# Asset migration checklist

Copy these files from your OLD repo into the NEW folders below.
File names in the new code already point to these paths — just drop
the files in and everything will work.

| Old file           | New location                          |
|---------------------|----------------------------------------|
| hero.jpg            | assets/images/hero.jpg  *(optional, no longer used — see note)* |
| container.jpg       | assets/images/container.jpg *(optional, no longer used — see note)* |
| button.png          | assets/images/button.png *(optional, no longer used)* |
| Winn.jpg            | assets/images/winn.jpg *(optional, no longer used)* |
| bgvideo.mp4         | assets/video/bgvideo.mp4  ✅ required |
| bgmusic.mp3         | assets/audio/bgmusic.mp3  ✅ required |
| tap.mp3             | assets/audio/tap.mp3      ✅ required |
| winning.mp3         | assets/audio/winning.mp3  ✅ required |
| entersound.mp3      | assets/audio/entersound.mp3 ✅ required |
| restart.mp3         | assets/audio/restart.mp3  ✅ required |

## Why some images are no longer required

The redesign moved away from image-textured backgrounds (hero.jpg,
container.jpg, button.png, Winn.jpg) to pure CSS gradients + glow
effects for the horror look. This:
- cuts page weight a lot (those 4 images were probably your biggest
  files)
- makes the theme consistent and easy to re-color later (just edit
  CSS variables in `css/styles.css`, no image editing needed)

If you liked the texture look and want it back, you can re-add
`background-image` rules in `styles.css` pointing at these files —
the new structure still has `assets/images/` ready for them.
