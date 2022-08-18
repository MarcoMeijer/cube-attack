# Cube attack

Cube attack is a simple tower defense game.

## Art style

I decided I would not use models and textures from the internet.
It would be hard to make this games using those models and textures, and make the game look consistent.
Because I need a lot of models for the towers and enemies.
So I dicided that I would need to create them myself,
and because I am not that good at 3d modeling I gave the game a simplistic art style.
Before I wanted to do a medievel theme, but that is too hard,
so I dicided on a futuristic/digital theme because it would be easier to create models.
And another benefit is that I can add a bloom effect which makes it look much better without much effort.
The models might not be that great, but at least the game looks consistent.

## Optimizing models

It was not needed to optimize models because they are all low poly, and most of them don't have a texture.
The floor is the only thing with a (PBR) texture, and it has a really small image size.
I decided to use png instead of jpg because if I made it a jpg it would have looked worse,
and because the image size is so small the texture is already less then a kilobyte so it makes no sense to optimize that.

## Shadows

Because there can be many enemies and bullets, I decided that those would not be able to cast shadows.
However, there is a limit on how many towers you can place so those will cast shadows.
The floor and towers are the only things that receive shadows.

## Drei

From drei I used the stars components, which adds a blinking shader-based starfield to the scene.

## Code inspiration

I used the game [cuberun](https://github.com/akarlsten/cuberun) as an inspiration for my code (and also a bit of the art style).
I have coded 3D games before, and also websites using react.
But I had never used react three fiber to create a game before,
and I was not sure how such a project would be structured.
Because using this xml like syntax to create a game is quite a new concept for me.
So this project was a good reference point for me.
