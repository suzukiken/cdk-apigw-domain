import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as cm from '@aws-cdk/aws-certificatemanager'
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

export class CdkapigwdomainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const PREFIX_NAME = id.toLocaleLowerCase().replace('stack', '')
    const DOMAIN_NAME = 'figmentresearch.com'
    const CERTIFICATE_ARN = 'arn:aws:acm:ap-northeast-1:00000000:certificate/xxxxx.......'
    const RECORD_NAME = 'greetings'
    
    const api = new apigateway.RestApi(this, 'api', { 
      restApiName: PREFIX_NAME + '-api',
      domainName: {
        domainName: RECORD_NAME + '.' + DOMAIN_NAME,
        certificate: cm.Certificate.fromCertificateArn(this, 'cm', 
          CERTIFICATE_ARN
        )
      },
    });
    
    new route53.ARecord(this, 'arecord', {
      zone: route53.HostedZone.fromLookup(this, 'zone', {
        domainName: DOMAIN_NAME
      }),
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
      recordName: RECORD_NAME
    })
    
    const integration = new apigateway.MockIntegration({
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': JSON.stringify({
          statusCode: 200
        })
      },
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'text/plain': 'こんばんわ'
        }
      }]
    })
    
    api.root.addMethod('GET', integration, {
      methodResponses: [{
        statusCode: '200',
        responseModels: {
          'text/plain': new apigateway.EmptyModel()
        }
      }]}
    )
  }
}
