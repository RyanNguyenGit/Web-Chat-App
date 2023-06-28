// configure websocket endpoints, and message broker 

package com.project.chatapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebsocketConfiguration implements WebSocketMessageBrokerConfigurer {
	
	//register STOMP endpoint
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws") 
				.setAllowedOriginPatterns("*")  //allow CORS request for all requests
				.withSockJS(); //enable SockJS support for the websocket endpoints
	}
	
	//configure message broker. Specify recognised prefixes for client subscription
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		//set destination prefix which defines path where application-specific messages will be sent/ handled by MessageMapping
		registry.setApplicationDestinationPrefixes("/app");
		//enable message broker. Clients that subscribe to these prefixes will receive messages sent to the corresponding destinations.
		registry.enableSimpleBroker("/chatroom", "/user");
		//set user destination prefix.
		registry.setUserDestinationPrefix("/user");
	}

}
