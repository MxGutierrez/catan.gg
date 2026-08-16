# The account that holds catan.gg. Override on the command line if needed.
AWS_PROFILE ?= maxi
export AWS_PROFILE

BUCKET := catan.gg
ACM_CERTIFICATE_ARN := arn:aws:acm:us-east-1:220005447721:certificate/b7d22ccf-7b7c-4e5c-95b9-2715bd9b9586
MAIL_TO := maxigutierrez23@gmail.com

# Read the distribution id from the alias, so no id is hard coded. The null
# check matters: a distribution with no alias makes contains() fail.
DIST_ID = aws cloudfront list-distributions \
	--query "DistributionList.Items[?Aliases.Items != null && contains(Aliases.Items,'$(BUCKET)')].Id | [0]" \
	--output text

STACK := catangg
CF_PARAMS := AcmCertificateArn=$(ACM_CERTIFICATE_ARN) ContactFormMailTo=$(MAIL_TO) SESIdentityName=$(MAIL_TO)
CF_CAPS := CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

# The lambda uses InlineCode, so there is nothing to package and `sam build`
# adds nothing. The aws cli drives CloudFormation directly, which also avoids
# the broken expat module in the sam cli on macOS.
#
# Read the changeset before you apply it. The last deploy would have failed
# had it touched the lambda, because that runtime was deprecated.
cf-preview:
	aws cloudformation deploy --template-file template.yml --stack-name $(STACK) \
		--parameter-overrides $(CF_PARAMS) --capabilities $(CF_CAPS) --no-execute-changeset

# Rollback stays on. A failed update should undo itself, not sit half applied.
cf-deploy:
	aws cloudformation deploy --template-file template.yml --stack-name $(STACK) \
		--parameter-overrides $(CF_PARAMS) --capabilities $(CF_CAPS)

# Deploy the site. The sync alone is not enough: CloudFront caches the HTML,
# so the edge keeps serving the old pages until they are invalidated.
deploy: build sync invalidate

build:
	npm run build

# Finder drops .DS_Store into public/, next copies public/ into out/, and the
# sync then publishes it. The file lists the folder contents, so keep it out.
sync:
	aws s3 sync ./out/ s3://$(BUCKET) --delete --exclude "*.DS_Store" --exclude "*/.DS_Store"

invalidate:
	@echo "Invalidating CloudFront..."
	@aws cloudfront create-invalidation \
		--distribution-id $$($(DIST_ID)) \
		--paths "/*" \
		--query "Invalidation.{Id:Id,Status:Status}" \
		--output table

.PHONY: cf-preview cf-deploy deploy build sync invalidate
