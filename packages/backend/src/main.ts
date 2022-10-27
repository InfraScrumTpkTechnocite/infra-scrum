import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { QueryFailedExceptionFilter } from './query-failed-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Enterprise Web Project')
    .setDescription('Scrum API description')
    .setVersion('1.0')
    .addTag('app')
    .addTag('kanbanstatus')
    .addTag('roles')
    .addTag('users')
    .addTag('projects')
    .addTag('tasks')
    .addTag('users-projects')
    .addTag('tasks-assignments')
    .addTag('tasktypes')
    .addTag('time-entries')
    .addBearerAuth()
    .addServer('backend')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new QueryFailedExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );
  
  app.setGlobalPrefix('/backend');
  await app.listen(3000);

  // --------WEB SOCKET SERVER----------- //
  const WebSocketServer = require('ws');
  // Creating a new websocket server
  const wss = new WebSocketServer.Server({ port: 8080 })
   
  // Creating connection using websocket
    wss.on("connection", ws => {
        console.log("new client connected");
        // sending message
        ws.on("message", (data: any) => {
            console.log(`Client with projectid ${ws} has sent us: ${data}`);
            wss.clients.forEach(function each(client) {
                if (client.params !== ws) {
                  client.send(data.toString());
                }
            });
        });
        // handling what to do when clients disconnects from server
        ws.on("close", () => {
            console.log("the client has disconnected");
        });
        // handling client connection error
        ws.onerror = function () {
            console.log("Some Error occurred")
        }
    });
    console.log("The WebSocket server is running on port 8080");
    /* ----------------------- */
}
bootstrap();
