#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkapigwdomainStack } from '../lib/cdkapigwdomain-stack';

const app = new cdk.App();
new CdkapigwdomainStack(app, 'CdkapigwdomainStack');
