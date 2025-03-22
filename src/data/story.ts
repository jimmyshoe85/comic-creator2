import { Page } from '../types';

export const storyPages: Record<string, Page> = {
  start: {
    id: 'start',
    content: `The streets of Harlem pulse with an otherworldly energy tonight. As Hughes walks through the familiar streets toward The Other Side speakeasy, something feels different. The air is thick with tension, and his dreams have been more vivid than ever.

Rose tends the bar as usual, but even she seems on edge. In the corner, a strange man watches Hughes too intently, his eyes reflecting light in an unnatural way.`,
    choices: [
      {
        text: 'Follow the man outside',
        nextPage: 'alley'
      },
      {
        text: 'Stay inside and observe',
        nextPage: 'inside'
      }
    ],
    images: [
      "https://cdn.midjourney.com/1e759961-916f-4019-8260-fc2a59cf4988/0_0.png",
      "https://cdn.midjourney.com/68642667-5f2a-4806-a6e8-20aea03e172a/0_3.png",
      "https://cdn.midjourney.com/b10f1e36-4902-4694-a77b-d77860048fe8/0_2.png"
    ]
  },
  alley: {
    id: 'alley',
    content: `The street outside warps and twists like a mirage. The man vanishes into thin air, and in his place stands a Tikbalang - a towering creature with the head of a horse and body of a man. The air distorts around it, buildings stretching and twisting impossibly.

The creature's eyes lock onto Hughes, and its mouth opens to speak.`,
    choices: [
      {
        text: 'Run before it speaks',
        nextPage: 'escape'
      },
      {
        text: 'Try to talk to it',
        nextPage: 'badEnd1'
      }
    ],
    images: [
      "https://cdn.midjourney.com/710a2016-a188-4ea7-be33-282dd6805a78/0_0.png",
      "https://cdn.midjourney.com/710a2016-a188-4ea7-be33-282dd6805a78/0_3.png",
      "https://cdn.midjourney.com/344764ae-ea75-41f7-ad72-f5abd4bd864b/0_1.png"
    ]
  },
  inside: {
    id: 'inside',
    content: `Inside The Other Side, Svetlana watches from across the room. The air crackles with unseen energy. Rose leans close, her voice barely a whisper: "That woman? She ain't here for the music."

Suddenly, the doors slam shut. The jazz band falls silent, and every eye in the room turns to Hughes.`,
    choices: [
      {
        text: 'Approach Svetlana',
        nextPage: 'svetlana'
      },
      {
        text: 'Slip out the back',
        nextPage: 'backAlley'
      }
    ],
    images: [
      "https://cdn.midjourney.com/c346fe8a-c06e-4c7d-9028-84672e30c65d/0_2.png",
      "https://cdn.midjourney.com/1e63526a-d12c-419e-9617-564b0f2c9f4b/0_0.png",
      "https://cdn.midjourney.com/1e63526a-d12c-419e-9617-564b0f2c9f4b/0_3.png"
    ]
  },
  escape: {
    id: 'escape',
    content: `Hughes bolts, the Tikbalang's laughter echoing through the twisted streets. The city itself seems to warp and bend as he runs, but somehow he makes it back to The Other Side.

Lilith stands at the door, her expression grave. "What the hell did you just run from, Hughes?"`,
    choices: [
      {
        text: 'Continue',
        nextPage: 'harlemChanging'
      }
    ],
    images: [
      "https://cdn.midjourney.com/7f15bd72-695e-4e94-81a3-e3a1c996b420/0_0.png",
      "https://cdn.midjourney.com/c346fe8a-c06e-4c7d-9028-84672e30c65d/0_1.png",
      "https://cdn.midjourney.com/7f15bd72-695e-4e94-81a3-e3a1c996b420/0_2.png"
    ]
  },
  badEnd1: {
    id: 'badEnd1',
    content: `The Tikbalang's words slither into Hughes' mind like poison. Ancient, forbidden knowledge tears through his consciousness. His grip on reality shatters.

In the days that follow, people whisper about a new ghost in Harlem - a lost soul wandering the streets, forever searching for something he can never find.`,
    isEnding: true,
    endingType: 'bad',
    images: [
      "https://cdn.midjourney.com/1e759961-916f-4019-8260-fc2a59cf4988/0_0.png",
      "https://cdn.midjourney.com/710a2016-a188-4ea7-be33-282dd6805a78/0_3.png",
      "https://cdn.midjourney.com/c346fe8a-c06e-4c7d-9028-84672e30c65d/0_2.png"
    ]
  },
  svetlana: {
    id: 'svetlana',
    content: `Svetlana's smile is too knowing, too perfect. "I've been waiting for you, Hughes. I can tell you everything about your past - who you really are. All you have to do is help me with one small task..."

Her words seem to wrap around your mind like silk threads, pulling you deeper into her influence.`,
    choices: [
      {
        text: 'Accept her offer',
        nextPage: 'badEnd2'
      },
      {
        text: 'Resist her influence',
        nextPage: 'harlemChanging'
      }
    ],
    images: [
      "https://cdn.midjourney.com/68642667-5f2a-4806-a6e8-20aea03e172a/0_3.png",
      "https://cdn.midjourney.com/1e63526a-d12c-419e-9617-564b0f2c9f4b/0_0.png",
      "https://cdn.midjourney.com/7f15bd72-695e-4e94-81a3-e3a1c996b420/0_0.png"
    ]
  },
  backAlley: {
    id: 'backAlley',
    content: `Two of Svetlana's thralls intercept Hughes in the alley. The fight is brutal and quick - Hughes barely escapes, but not without injury. Blood trickles from a cut above his eye as he stumbles through the twisting streets.`,
    choices: [
      {
        text: 'Continue',
        nextPage: 'harlemChanging'
      }
    ],
    images: [
      "https://cdn.midjourney.com/b10f1e36-4902-4694-a77b-d77860048fe8/0_2.png",
      "https://cdn.midjourney.com/344764ae-ea75-41f7-ad72-f5abd4bd864b/0_1.png",
      "https://cdn.midjourney.com/1e63526a-d12c-419e-9617-564b0f2c9f4b/0_3.png"
    ]
  },
  harlemChanging: {
    id: 'harlemChanging',
    content: `The city itself is changing. Buildings flicker between past and present like a damaged film reel. Ghosts walk the streets in broad daylight, and the air tastes like copper and starlight.

Lilith finds Hughes again. "They're opening a gate, Hughes. We're running out of time."`,
    choices: [
      {
        text: 'Find Azha for help',
        nextPage: 'azha'
      },
      {
        text: 'Go alone',
        nextPage: 'badEnd3'
      }
    ],
    images: [
      "https://cdn.midjourney.com/c346fe8a-c06e-4c7d-9028-84672e30c65d/0_1.png",
      "https://cdn.midjourney.com/7f15bd72-695e-4e94-81a3-e3a1c996b420/0_2.png",
      "https://cdn.midjourney.com/1e759961-916f-4019-8260-fc2a59cf4988/0_0.png"
    ]
  },
  badEnd2: {
    id: 'badEnd2',
    content: `Svetlana's influence seeps into Hughes' mind like sweet poison. His memories fade, replaced by her will. He becomes nothing more than a puppet, dancing to her tune.

The real Hughes is gone, lost forever in the depths of his own mind.`,
    isEnding: true,
    endingType: 'bad',
    images: [
      "https://cdn.midjourney.com/710a2016-a188-4ea7-be33-282dd6805a78/0_0.png",
      "https://cdn.midjourney.com/c346fe8a-c06e-4c7d-9028-84672e30c65d/0_2.png",
      "https://cdn.midjourney.com/1e63526a-d12c-419e-9617-564b0f2c9f4b/0_0.png"
    ]
  },
  azha: {
    id: 'azha',
    content: `Azha's eyes widen when she sees Hughes. "I should have known," she whispers. "You're part Jinn - it's in your blood. The Qalb Al Atlas belongs to your bloodline. You're the only one who can control it."

"But first," she continues, "we need to steal it back before Svetlana completes her ritual."`,
    choices: [
      {
        text: 'Continue to the final heist',
        nextPage: 'finalHeist'
      }
    ],
    images: [
      "https://cdn.midjourney.com/68642667-5f2a-4806-a6e8-20aea03e172a/0_3.png",
      "https://cdn.midjourney.com/b10f1e36-4902-4694-a77b-d77860048fe8/0_2.png",
      "https://cdn.midjourney.com/344764ae-ea75-41f7-ad72-f5abd4bd864b/0_1.png"
    ]
  },
  badEnd3: {
    id: 'badEnd3',
    content: `Alone, Hughes is overwhelmed by the illusions that plague Harlem. Reality bends and twists until he can no longer tell what's real and what isn't.

He disappears into the void between worlds, another victim of forces he couldn't understand.`,
    isEnding: true,
    endingType: 'bad',
    images: [
      "https://cdn.midjourney.com/710a2016-a188-4ea7-be33-282dd6805a78/0_3.png",
      "https://cdn.midjourney.com/1e63526a-d12c-419e-9617-564b0f2c9f4b/0_3.png",
      "https://cdn.midjourney.com/7f15bd72-695e-4e94-81a3-e3a1c996b420/0_2.png"
    ]
  },
  finalHeist: {
    id: 'finalHeist',
    content: `Hughes, Azha, and Lilith break into Svetlana's lair. The ritual is already beginning - dark energy crackles through the air, and the walls pulse with an unholy light.

Time is running out.`,
    choices: [
      {
        text: 'Face Svetlana head-on',
        nextPage: 'badEnd4'
      },
      {
        text: 'Try to disrupt the ritual',
        nextPage: 'goodEnd'
      }
    ],
    images: [
      "https://cdn.midjourney.com/c346fe8a-c06e-4c7d-9028-84672e30c65d/0_1.png",
      "https://cdn.midjourney.com/1e759961-916f-4019-8260-fc2a59cf4988/0_0.png",
      "https://cdn.midjourney.com/68642667-5f2a-4806-a6e8-20aea03e172a/0_3.png"
    ]
  },
  badEnd4: {
    id: 'badEnd4',
    content: `Svetlana's power is too great. She overwhelms Hughes with ease, and Setekh is fully summoned into our world.

Darkness falls over Harlem, and soon, the rest of the world follows.`,
    isEnding: true,
    endingType: 'bad',
    images: [
      "https://cdn.midjourney.com/b10f1e36-4902-4694-a77b-d77860048fe8/0_2.png",
      "https://cdn.midjourney.com/710a2016-a188-4ea7-be33-282dd6805a78/0_0.png",
      "https://cdn.midjourney.com/344764ae-ea75-41f7-ad72-f5abd4bd864b/0_1.png"
    ]
  },
  goodEnd: {
    id: 'goodEnd',
    content: `Hughes outsmarts Svetlana, stealing the Qalb Al Atlas at the crucial moment. With his newfound power, he banishes Setekh before the ritual can complete.

Harlem returns to normal, but Hughes knows the supernatural war isn't over. Back at The Other Side, Rose pours him a drink. "So what now?"

Hughes smirks, "Now? I write the story."`,
    isEnding: true,
    endingType: 'best',
    images: [
      "https://cdn.midjourney.com/1e63526a-d12c-419e-9617-564b0f2c9f4b/0_0.png",
      "https://cdn.midjourney.com/c346fe8a-c06e-4c7d-9028-84672e30c65d/0_2.png",
      "https://cdn.midjourney.com/7f15bd72-695e-4e94-81a3-e3a1c996b420/0_0.png"
    ]
  }
};