include .env

cf-deploy:
	sam build && sam deploy --stack-name catangg --parameter-overrides AcmCertificateArn=${ACM_CERTIFICATE_ARN} ContactFormMailTo=maxigutierrez23@gmail.com SESIdentityName=maxigutierrez23@gmail.com --no-confirm-changeset --capabilities CAPABILITY_IAM --disable-rollback

deploy:
	npm run build && aws s3 sync ./out/ s3://catan.gg --delete
