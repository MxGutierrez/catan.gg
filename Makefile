# .env only holds the values cf-deploy needs, so a missing file is fine here.
-include .env

BUCKET := catan.gg

# Read the distribution id from the alias, so no id is hard coded.
DIST_ID = aws cloudfront list-distributions \
	--query "DistributionList.Items[?contains(Aliases.Items,'$(BUCKET)')].Id | [0]" \
	--output text

# Deploy the infrastructure. Needs ACM_CERTIFICATE_ARN in .env.
cf-deploy:
	sam build && sam deploy --stack-name catangg --parameter-overrides AcmCertificateArn=${ACM_CERTIFICATE_ARN} ContactFormMailTo=maxigutierrez23@gmail.com SESIdentityName=maxigutierrez23@gmail.com --no-confirm-changeset --capabilities CAPABILITY_IAM --disable-rollback

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
