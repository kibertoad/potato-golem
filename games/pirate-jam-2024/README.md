# We Have Homunculus at Home
A HTML5 game, initially made for [Pirate Software - Game Jam 15](https://itch.io/jam/pirate).

# Audio
We decided to go with [FMOD](https://www.fmod.com/) for game audio, since it does not have the issues present in other WebAudio implementations, mainly for looping or creating multi-layered music tracks.

Using FMOD Studio is free for Indie developers with less than $200k revenue per year and a development budget under $600k. After the threshold is reached, the price is $2000 per game ([FMOD Licensing](https://www.fmod.com/licensing)).

## Prerequisites
To add new sounds or music to the game, you need to [download and install FMOD Studio](https://www.fmod.com/download#fmodstudio) (a free account is required to download).

## FMOD project
All audio is managed via the FMOD project located at [assets/audio/fmod](assets/audio/fmod). 

In very simple terms, all audio in FMOD is organized into [events](https://www.fmod.com/docs/2.02/studio/fmod-studio-concepts.html#event) and [events](https://www.fmod.com/docs/2.02/studio/fmod-studio-concepts.html#event) are then grouped into audio [banks](https://www.fmod.com/docs/2.02/studio/fmod-studio-concepts.html#banks) (you can think of banks as sound libraries, which can be loaded separately into the memory).

![image](https://github.com/user-attachments/assets/e119ebf7-aa4e-4cf8-9427-56d3f734d759)

## Adding SFX
To add a new audio file to the game, simply drag and drop an audio file into the `Assets` tab, preferably into its corresponding folder for organization purposes.

After the file has been added, you need to create an audio event - right-click on the newly added asset and choose `Create Event`

![image](https://github.com/user-attachments/assets/48107426-3e0c-4dab-9414-38e2b43316a8)

Since it is a sound effect, we need to choose `2D Action` for the event type and click `Create`

![image](https://github.com/user-attachments/assets/4043cf10-adb3-4e46-9206-416f32e26ad3)

The newly created event will appear in the `Events` tab. Drag it to the corresponding folder for organization purposes

![image](https://github.com/user-attachments/assets/87348a07-ea44-44e3-909e-5c20fa06aa20)

You can notice the `#unassigned` tag to the right of the event. This is because the event is not yet assigned to a bank. Right-click the event and choose `Assign to Bank -> Browse` and in our case assign it to the `Sfx` bank

![image](https://github.com/user-attachments/assets/09c5e101-e671-4b67-ad98-1bcffd33e5ae)

Don't forget to [build the banks](#building-banks) after adding new events.

## Adding Music
Music is also an event, with an exception that it's type should be `2D Timeline`

![image](https://github.com/user-attachments/assets/8f9bf00f-55c2-4392-beb9-90be9a5d5a40)

I will not go into detail about creating Music loops, however, feel free to refer to this short [YouTube Tutorial](https://www.youtube.com/watch?v=uKFhCqHtDl4) on creating loops in FMOD.

## Using Audio events
To play an event in-game, you need to know its `Path`. To get the path of the event, simply right-click the event and choose `Copy Path`, in our case the path is `event:/Sfx/poof`.

![image](https://github.com/user-attachments/assets/a0ac6e3c-349a-45eb-9575-06d72602b936)

Currently, SFX event definitions are stored in [src/model/registries/sfxEventRegistry.ts](src/model/registries/sfxEventRegistry.ts), so don't forget to define your new events there.

## Building banks
For the new Audio to appear in the game, you need to build the project. For this, simply press `F7` or choose `File -> Build`

![image](https://github.com/user-attachments/assets/0cd512f2-700b-4ce2-8ea6-ddafd958cc65)

If you've added new Banks to the project, you also need to include the bank file in the [src/initFmod.ts](src/initFmod.ts) file, otherwise, you are good to go!

![image](https://github.com/user-attachments/assets/0a49041a-d838-4bbb-a230-dfd51f920150)


