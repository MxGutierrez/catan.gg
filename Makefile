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

# Deploy the infrastructure. Every value it needs is set above.
cf-deploy:
	sam build && sam deploy --stack-name catangg --parameter-overrides AcmCertificateArn=$(ACM_CERTIFICATE_ARN) ContactFormMailTo=$(MAIL_TO) SESIdentityName=$(MAIL_TO) --no-confirm-changeset --capabilities CAPABILITY_IAM --disable-rollback

# Deploy the site. The sync alone is not enough: CloudFront caches the HTML,
# so the edge keeps serving the old pages until they are invalidated.
deploy: build sync invalidate

build:
	npm run build

sync:
	aws s3 sync ./out/ s3://$(BUCKET) --delete

invalidate:
	@echo "Invalidating CloudFront..."
	@aws cloudfront create-invalidation \
		--distribution-id $$($(DIST_ID)) \
		--paths "/*" \
		--query "Invalidation.{Id:Id,Status:Status}" \
		--output table

.PHONY: cf-deploy deploy build sync invalidate
