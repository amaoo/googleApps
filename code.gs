
// 获取表单内容
const getInputs = responses => {
  let inputs = []
  responses.forEach(res => {
    inputs.push({
      title: res.getItem().getTitle(),
      response: res.getResponse()
    })
  })
  
  return inputs
}

// 内容组合
const createMessages = inputs => {
  let body = ""
  inputs.forEach(input => {
    body += "■" + input.title
      + "\n\n"
      + input.response
      + "\n\n"
  })

  return body
}

// 发送到slack
const sendToSlack = (messages, form_title) => {
  let url = "**************";//slack hook url
  let data = { 
    "channel" : "#test",
    "username" : "test",
    "attachments": [{
      "title": form_title,
      "text" : messages,
    }],
  };
  let payload = JSON.stringify(data);
  let options = {
    "method" : "POST",
    "contentType" : "application/json",
    "payload" : payload
  };

  UrlFetchApp.fetch(url, options);
}


// 发送到 redmine
const sendToRedmine = (messages,form_title) => {
  let end_point = 'https://********';// redmine 地址
  let token = '**************************';
  let url = end_point + '/issues.json?key=' + token;

  let data = {
    "issue": {
        "project_id": "",
        "subject": form_title,
        "description": messages,
        // "tracker_id": "",  // 跟踪
        // "status_id": ""  // 状态
        // "priority_id": "",  // 优先级
        // "category_id": "",  // 类别
        // "fixed_version_id": "",  // 目标版本
        // "assigned_to_id": "",  // 担当者
        // "parent_issue_id": "",  // 父任务
        // "custom_fields": "",  // 标签
        // "watcher_user_ids": "",  // 关注者
        // "is_private": "",  // 是否私有 true or false
        // "estimated_hours": ""   // 预期时间
    }
  };

  let payload = JSON.stringify(data);
  let options = {
    "method" : "POST",
    "contentType" : "application/json",
    "headers": {
      "Authorization": "**********" //basic 认证
    },
    "payload" : payload
  };

  UrlFetchApp.fetch(url, options);
}

// 主方法，触发器调用此方法
const onSubmit = e => {
  console.log(e)
  // 获取表单标题
  const form_title = e.source.getTitle();
  const inputs = getInputs(e.response.getItemResponses());
  const messages = createMessages(inputs);
  sendToRedmine(messages,form_title);
  sendToSlack(messages, form_title);
}
