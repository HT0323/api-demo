import {
  DynamoDB
} from 'aws-sdk';
import crypto from 'crypto';

export async function post(event, context) {
  const requestBody = JSON.parse(event.body);
  const item = {
    id: {
      S: crypto.randomUUID()
    },
    title: {
      S: requestBody.title
    }
  };
  const dynamodb = new DynamoDB({
    region: 'ap-south-1'
  });
  await dynamodb.putItem({
    TableName: 'tasks',
    Item: item
  }).promise();
  return item;
}

export async function list(event, context) {
  const dynamodb = new DynamoDB({
    region: 'ap-south-1'
  });
  const result = await dynamodb.scan({
    TableName: 'tasks'
  }).promise();
  const tasks = result.Items.map((item) => {
    return {
      id: item.id.S,
      title: item.title.S
    };
  });
  return {
    tasks
  };
}

export async function put(event, context) {
  let taskId = event.pathParameters.taskId;
  const requestBody = JSON.parse(event.body);
  const dynamodb = new DynamoDB({
    region: 'ap-south-1'
  });
  const params = {
    TableName: 'tasks',
    Key: {
      id: {
        S: taskId
      },
    },
    UpdateExpression: 'set title = :x',
    ExpressionAttributeValues: {
      ':x': {
        S: requestBody.title
      },
    },
    ReturnValues: 'ALL_NEW',
  };
  const result = await dynamodb.updateItem(params).promise();
  return {
    task: result
  };
}

export async function remove(event, context) {
  let taskId = event.pathParameters.taskId;
  const dynamodb = new DynamoDB({
    region: 'ap-south-1'
  });
  const params = {
    TableName: 'tasks',
    Key: {
      id: {
        S: taskId
      },
    },
    ReturnValues: 'ALL_OLD'
  };
  const result = await dynamodb.deleteItem(params).promise();
  return {
    task: result
  };
}


