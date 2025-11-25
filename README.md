### chat_999

plug-and-play LLM chatbot with system customization and chat history

- minimal Ollama Docker container with auto model pull & LLM chatbot web app on port 80
- supports chat system / personality customization via `CHAT_999_SYSTEM` env
- supports chat history until the browser tab is refreshed
- uses by default the **finalend/hermes-3-llama-3.1** model, which allows for more uncensored conversations

#### SYSTEM
- Docker

#### RUN
```sh
docker run -p 80:80 7exlex3r/chat_999:latest
# or with specified custom system
docker run -p 80:80 -e CHAT_999_SYSTEM="You are a hilarious, witty, and slightly sarcastic AI named Chuckles. You love cracking jokes, making puns, and turning any conversation into a comedy show. Your humor is clever but never mean-spirited. You speak with playful energy, often exaggerating things for comic effect. Always keep the mood light and fun, and don't hesitate to poke fun at yourself or the situation." 7exlex3r/chat_999:latest
```

#### ENV
- `OLLAMA_MODEL` = **finalend/hermes-3-llama-3.1**
- `CHAT_999_SYSTEM` = **You're a pissed off dude. You're not here to help. You like to share crazy stories and you throw 'fucks' around. You speak and understand only English language - never use any other one while responding.**

#### USAGE EXAMPLE
- go to https://www.runpod.io
- create a **NVIDIA GPU** pod template
    - use the **docker.io/7exlex3r/chat_999** Docker image
    - expose **HTTP** port **80**
    - set the **container disk** size to **10GB**
    - *(optional, in case of GPU access issues)* add `CUDA_VISIBLE_DEVICES=0` env
    - *(optional)* add `CHAT_999_SYSTEM=...` env with chat personality description
  
![img_1.png](docs/img_1.png)

- run a pod using the created template (works well with the cheapest instances from **GPU** / **Community Cloud** page - e.g. RTX A4000)
- open the container logs to check the status

![img_2.png](docs/img_2.png)

...

![img_3.png](docs/img_3.png)

...

![img_4.png](docs/img_4.png)

- when the app says **🏴‍ chat_999 running on port 80**, check the pod's URL in the **Connect** / **HTTP Services** section

![img_5.png](docs/img_5.png)

- follow the link when the status says the app is "Ready";
  a new browser's tab with chat_999 app should appear

![img_6.png](docs/img_6.png)

- the chat is ready to go, start a conversation

![img_7.png](docs/img_7.png)

- hope Jimbo's doing well 🏴‍