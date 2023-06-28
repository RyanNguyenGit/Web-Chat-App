//handle incoming client messages

package com.project.chatapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.project.chatapp.controller.model.Message;

@Controller
public class ChatController {
	
	
	@Autowired
	private SimpMessagingTemplate simpMessagingTemplate;
	
	//purpose: aws beanstalk requires root path for health check
	@GetMapping(path="/")
	public String healthCheck() {
		return "200";
	}
	
	//handle public messages sent from client to '/app/message'
	@MessageMapping("/message") 
	@SendTo("/chatroom/public")  //send to clients subscribed to /chatroom/public
	public Message handlePublicMessage(@Payload Message message) {
		return message;
	}
	
	//send message to unique users
	@MessageMapping("/private-message")
	public Message handlePrivateMessage(@Payload Message message) {
		//send to subscribed user '/user/{receiver name}/private'
		simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private", message);
		return message;
	}
}
