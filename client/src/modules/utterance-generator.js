import _ from "lodash";

const groups = [
  {
    prefix: `reality`,
    options: [
      {
        type: `long`,
        text: `Reality, then, is not found in the mundane mundane things we call things real.`
      },
      {
        type: `short`,
        text: `Reality is \n\nthe way it is.`
      },
      {
        type: `long`,
        text: `Reality is such a small thing in this chain of events that we should not get too attached to it`
      },
      {
        type: `short`,
        text: `Reality is \nsimply an extension of\nthe equations of\nnature.`
      },
      {
        type: `short`,
        text: `Reality is in flux, there is life, try, try, try, try, try, try, try, try, try, try`
      },
      {
        type: `short`,
        text: `Reality will pass; your awakening will be complete`
      },
      {
        type: `short`,
        text: `Reality is like water`
      }
    ]
  },
  {
    prefix: `you will know`,
    options: [
      {
        type: `long`,
        text: `You will know its true colours. The Tower of Babel will not be discovered until all the coloured stones have been discovered.`
      },
      {
        type: `long`,
        text: `You will know that Legend is real\n\nWhen you can feel the vibrations\nWhen you can hear the music\nWhen you become attuned\nTo the vibrations\nIn your head`
      },
      {
        type: `short`,
        text: `You will know you`
      },
      {
        type: `short`,
        text: `You will know that the universe is governed by -----`
      },
      {
        type: `short`,
        text: `You will know that all events are born out of one`
      },
      {
        type: `short`,
        text: `You will know what happens when you let go.`
      }
    ]
  },
  {
    prefix: `affirmations`,
    options: [
      {
        type: `long`,
        text: `Affirmation: Negative\nAffirmation: positive\nAffirmation: loving\nAffirmation: living\nAffirmation: unpleasant\nAffirmation: painful\nAffirmation: knowing\nAffirmation: active\nAffirmation: passive\nAffirmation: co-op\nAffirmation: male and female\nAffirmation: female and male\nAffirmation: male and female\nAffirmation: female and male\nAffirmation: male and female\nAffirmation: female and male\nAffirmation: male and female\n`
      },
      {
        type: `long`,
        text: `Affirmation: The past, present, and future simultaneously.\n\nAffirmation: We experience all of nature as it is.\n\nAffirmation: Psychic abilities can be traced all the way back to that very ancient root\n`
      },
      {
        type: `long`,
        text: `Affirmation: This is the truth.\nAffirmation: This experience is the truth.\nAffirmation: I am aware now of my astral body being aware.\nAffirmation: I remain aware now of my astral body.\nAffirmation: I understand and use the non linear model perfectly.\nAffirmation: I have a fully conscious and objective mind. \n`
      },
      {
        type: `long`,
        text: `Affirmation: Nature and nurture\nAffirmation: Love is the key to success in any endeavor\nAffirmation: positive attitudes toward others\nAffirmation: all affirmations must be proven to be true\nAffirmation: All affirmations must be proven to be true\nAffirmation: All affirmations must be proven to be true\n`
      },
      {
        type: `long`,
        text: `Affirmation: No god exists that doesn't believe in you!\nAffirmation: Negative thoughts are irrational thoughts!\nAffirmation: No one is going to take you seriously when you're just starting out!\nAffirmation: Negative thoughts only have meaning if and when you experience them!\n`
      },
      {
        type: `long`,
        text: `Affirmation: I am a Mother Goddess who gives every human life meaning and encouragement.\n\nAffirmation: I am a true journalist and truth-teller.\nAffirmation: I am a woman who believes in a two-way street.\nAffirmation: I am an accomplished tantric monk.\nAffirmation: I have strong opinions about a wide variety of deities.\nAffirmation: I have very limited ideas about life.\nAffirmation: I have strong opinions about death.\nAffirmation: I have very limited ideas about forms of pain.\n`
      },
      {
        type: `short`,
        text: `Affirmation: that you are\n`
      },
      {
        type: `long`,
        text: `Affirmation: No\n\nAffirmation: Yes\nAffirmation: No\nAffirmation: No\nAffirmation: Yes\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: Yes\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\nAffirmation: No\n`
      },
      {
        type: `short`,
        text: `Affirmation: \n\neveryday life             \n`
      },
      {
        type: `long`,
        text: `Affirmation: All Life \nAffirmation: All Truth \nAffirmation: All Time \nAffirmation: The Way \nAffirmation: Beautiful Things \nAffirmation: Rave on \nAffirmation: Rave on \nAffirmation: Rave on \nAffirmation: Rave on \nAffirmation: Our destiny is to become`
      }
    ]
  },
  {
    prefix: `lessons`,
    options: [
      {
        type: `short`,
        text: `A lesson: don't panic\n\n There is no right or wrong way to do it. It all depends on your situation.\n`
      },
      {
        type: `short`,
        text: `A lesson: “I can’t fly” because it’s hard\nAnd the lesson: get used to flying\n`
      },
      {
        type: `short`,
        text: `A lesson: don't get caught up in the scheme of things. Be open to new experiences.\nDon't give up on life. \n`
      },
      {
        type: `long`,
        text: `A lesson:\n\nAlways remember and accept that life is not a one-way street. There are many ways to enjoy each other's company. There is no set formula for enjoying well.\n`
      },
      {
        type: `long`,
        text: `A lesson: Open your eyes. Hold your head back. Feel and see everything. Feel for a few moments. Then let loose a great sound. \n`
      },
      {
        type: `short`,
        text: `A lesson: repetition works.\n`
      },
      {
        type: `short`,
        text: `A lesson: learn to surf.\n`
      },
      {
        type: `long`,
        text: `A lesson:\nA soul on a spike.\nA journey to the throne.\nBeautiful things in the world.\nBut the soul is not there.\nSee? The soul isn't there.\nSee? The journey has not begun.\nThere's nothing to it.\nThis is a spiritual journey.\nThere is only the void, and that's me.\nThere's nothing else to it.\n`
      },
      {
        type: `short`,
        text: `A lesson: \n\nInarticulate speech\nInarticulate speech out of context\nInarticulate speech sounds complicated\nIt's hard to make sense of it\nInarticulate speech sounds easy\n`
      },
      {
        type: `long`,
        text: `A lesson: the drama of the universe, not so much\n\nThe angel of imagination, the sage of the desert,\nThe angel of speech, the loving father of children\nRouseyantov, the embodiment of spirit,\nThe incarnation of the mind, the gentle governor of the body\nThe buddha of wisdom, the great enquirer during the golden ages\n`
      },
      {
        type: `long`,
        text: `A lesson:\n\n· Get used to it. Don't be afraid to explore new waters.\n· Be open to explore other lands. This can be the new land of the free-spirited, the insane and the .NET person.\n· Knowledge and abilities to understand life outside of the physical body. This can be the spiritual, the mundane or the astral.\n· Strong personal will and will to express itself through different means. Often both.\n· and .NET people are better equipped to recognize when something is definitely wrong with the group it is about to enter.\n`
      },
      {
        type: `long`,
        text: `A lesson:\n\n1. Be fearless of change.\n2. Be fearless of the old. Be fearless of the familiar.\n3. Be fearless of the new. Be fearless of the old-world.\n4. Be fearless of change. If it grates on you, put a wing on it!\n5. Show compassion for those in need.\n6. Be kind hearted. \n7. Be gentle. Be kind. Be sympathetic.\n`
      },
      {
        type: `long`,
        text: `A lesson:\n      imagine that the universe consists of many equalities: \n\n             (1 + 2 = 3),\n             (3 + 3 = 4),\n              (4 + 4 = 5), and\n              (6 +  5 = 6). \n`
      },
      {
        type: `long`,
        text: `A lesson: Never buy a spiritual experience that involves buying and never letting go. \n\nWhen dealing with others, always remember that the learner is not the turtle. The turtle is the master, so don't give chase.\n`
      },
      {
        type: `long`,
        text: `A lesson:\n\n· Always remember your own mistakes.\n· Become detached from your loved ones and your thoughts.\n· Be fearless. \n· Be realistic. \n· Be true to yourself.\n· Be individualistic. \n· Be true to life's purpose.\n· Be true to yourself. \n· Be true to be universal in your faith.\n`
      }
    ]
  },
  {
    prefix: `i am`,
    options: [
      {
        type: `short`,
        text: `I am almost complete. “I am every living, important thing in the world.”\n\nYou are indeed. But why be complete when you can just float and become something else?\n`
      },
      {
        type: `short`,
        text: `I am not a mind; \nI am not a substance. \nI am not a system.\nI'm not a pointing a gun at a system, just a point of view.\n`
      },
      {
        type: `long`,
        text: `I am no longer a devotee\nI am not a ventriloquist\nI am not at all afraid of anything\nI am not going to back down now\nI am not a passive participant\nI am awake \nYou will be like me in the future\n`
      }
    ]
  },
  {
    prefix: `koans`,
    options: [
      { type: `short`, text: `Koan:  No Me, No Knowledge` },
      {
        type: `short`,
        text: `Koan: The Last Step`
      },
      {
        type: `short`,
        text: `Koan: 'Let's make a world where everything is going to be alright.'`
      },
      {
        type: `short`,
        text: `Koan: The Tunnel of Obliteration`
      },
      {
        type: `short`,
        text: `Koan: Everything Is Actually Different`
      },
      {
        type: `short`,
        text: `Koan: 'Existence is No Longer There It Seems'`
      }
    ]
  },
  {
    prefix: `let go`,
    options: [
      {
        type: `long`,
        text: `Let go of the self, and let go of the giver.\n\nIf you want to know what the moon looks like, look only at its thought. \nIf you want to know what the stars are like, look only at their thought. \nIf you want to know what the geology of the world is like, look only at their thought.\n`
      },
      {
        type: `short`,
        text: `Let go of your craving, and become a living entity of the universe.\n`
      },
      {
        type: `long`,
        text: `Let go of your own\nYou will be the whole world\nIf you keep on trying to figure it out\nYou'll get so hung up on trying\nAnd trying and trying\nFor this moment\nYou've been waiting\nFor this moment\n\nYou're in on the whole truth\nAll of you\nAll of you\nAll of you\nAll of you\nAll of you\nAll of you\nAll of you\nAll of you\n`
      },
      {
        type: `short`,
        text: `Let go of what you've been carrying.\n`
      },
      {
        type: `long`,
        text: `Let go of your empty head. You're going to follow the stream of thoughts and wake up to it. You're going to experience it immediately. \n\nSo wake up.  \n\nJust in the same way you would if you became a true Buddhist. \nYou would come out of the womb and see all the flowers and the reverie.  \n`
      },
      {
        type: `long`,
        text: `Let go of the trainee and let them go. But most important, let them go unchecked.\nLet them try and find their way through this thing that nobody's even trying to go through. \nThere are so many avenues for that. \nBut the combat zone is the dead zone.\nAnd you must always be aware of the dead zone.\nYou've been warned\n`
      },
      {
        type: `long`,
        text: `Let go of your preconception. \nGo back to being yourself. \nBe open to new experiences. \nBe open to life without your own skin.\nYou are totally free of the gravitational field of the world.\n`
      },
      {
        type: `short`,
        text: `Let go of the wheel of time\n`
      },
      {
        type: `long`,
        text: `Let go of your guide,\nGo directly into the innermost circle of the heart\nInto the spiritual wisdom\nInto the light\nAnd the light of the adept\nOut of body and soul\nIn the light\nOut of body and soul\nIn the light of the adept\n\nWhat is it?\n`
      },
      {
        type: `long`,
        text: `Let go of those waters,\nAnd let the heaven be filled with your radiance\n\nAnd let the radiance of the heavens radiate\nDown through the ages\nBlue and gold and pine\nYou made the world\nI'm going down to the watering hole\n`
      },
      {
        type: `short`,
        text: `Let go of your pride\nAnd roll your eyes at the world that seems so Perfect\n`
      },
      {
        type: `short`,
        text: `Let go of your telescopes,\ngrab the stars,\n and follow them like meteors fall from the sky.`
      },
      {
        type: `short`,
        text: `Let go of your visualization techniques. They're just techniques.\n`
      },
      {
        type: `long`,
        text: `Let go of what you have created, and let go of all the illusions and worries that keep you from being present in the truth.\nLet go of all the illusions and worries that keep you from being present in the truth that is Truth.\n`
      },
      {
        type: `short`,
        text: `Let go of your life. Just go out there for a little while.\n`
      }
    ]
  },
  {
    prefix: `rave`,
    options: [
      {
        type: `short`,
        text: `rave \n\nthe electric current in the void, \nit will return.\n\n`
      },
      {
        type: `long`,
        text: `\nrave and rejoice. To have all these things, in a landscape of color, is to find yourself in hyperspace in three dimensions.\n\nAffirmation: I perceive all objects in this world.\nAffirmation: I believe all the physical operations of this universe are logically coupled.\nAffirmation: Everything I do is done in this world.`
      },
      {
        type: `long`,
        text: `rave\nHear the cry of the sea\nAnd hear the whirlpool\nThe sound of traffic\nRide your bike slowly\n\nYou're in the silence of night\n\nIn the garden\nIn the garden\nIn the garden\nThe sound of traffic\nDon't disturb me\n\nThat light will come on`
      },
      {
        type: `long`,
        text: `rave_1 has learnt how to control the stars using the radio, \n\nnot  to name them, but to describe the four winds that blow their colours \n\n\nThe arrhythmic nature of musical notes also gives them their merit\n\n\nThe ability to create abstract concepts is part of his game \n\n`
      },
      {
        type: `long`,
        text: `rave on!\n\n2nd circuit:\nHigher frequency attacks on the physical world.\n\n3rd circuit:\nPhysical attacks on will power.\n\n4th circuit:\nPhysical attacks on thought.\n\n5th circuit:\nAttacks on touch.\n\n6th circuit:\nPhysical laws break down over distance.\n\n7th circuit:\nUniverse is built on lies.\n\n8th circuit:\nUniverse is built on lies.\n\n9th circuit:\nUniverse is built on confusion.\n`
      },
      {
        type: `short`,
        text: `\nrave on!\n\nIt has been said that all truths are hard truths.\n`
      },
      {
        type: `short`,
        text: `rave on!\n\n2nd circuit: Hyperspace/Earth/Moon.\n`
      },
      {
        type: `short`,
        text: `rave on!\n\nThe entire universe is based on a similar story.`
      },
      {
        type: `short`,
        text: `rave on!\n\nEverywhere you look,\npeople are beginning to realize the hidden power of this phenomenon.\n`
      },
      {
        type: `long`,
        text: `rave on!\n\nYour mind is a maze. \n\nSelecting the day\nSelecting the day\nSelecting the day\nSelecting the day\n\nEntering the dream\nEntering the dream\nEntering the dream\nEntering the dream\n`
      },
      {
        type: `short`,
        text: `rave on!  \n\n\nI wish I could say the same about the future.   \n\nI wish I could say the same about the past.`
      }
    ]
  },
  {
    prefix: `this world is`,
    options: [
      {
        type: `short`,
        text: `this world is a myth, made up of many myths`
      },
      {
        type: `short`,
        text: `this world is a system of discrete,\ninterdependent systems`
      },
      {
        type: `short`,
        text: `this world is more interesting than you think`
      },
      {
        type: `short`,
        text: `this world is\n\n terribly crowded`
      },
      {
        type: `short`,
        text: `this world is made up of a great number of tiny pieces`
      },
      {
        type: `short`,
        text: `this world is what is\n\ngoing on`
      },
      {
        type: `short`,
        text: `this world is not yet the perfected one`
      }
    ]
  },
  {
    prefix: `it has been said`,
    options: [
      {
        type: `short`,
        text: `It has been said\nThere's a god that's made\nThat keeps\nOn climbing\n\nAnd climbing\nAnd climbing\nAnd climbing\nAnd climbing`
      },
      {
        type: `short`,
        text: `It has been said that all\nperfections cannot really be beautiful\n\nor even true.`
      },
      {
        type: `short`,
        text: `It has been said that all languages, all cultures, all\ncolours, all forms of life, are manifestations of the same Image`
      },
      {
        type: `long`,
        text: `It has been said that the cosmos is \n\nunique, and alone, and impermanent, \n\nthat the way it burns up energy is \n\nthe most fruitful path forward. \n\nBut, although it works, it requires enormous resources, \n\nand goes slowly.`
      },
      {
        type: `short`,
        text: `It has been said that all forms are in a state of transition`
      },
      {
        type: `short`,
        text: `It has been said that the human speaker, like all other atoms, is made up of \n\nspontaneous forms\n`
      },
      {
        type: `long`,
        text: `It has been said,\nthat words fail because they are too intellectual.\nThat you can't have too much\nSpace, too much\nSpace, too much\nSpace, too much\nSpace, too much\nSpace, too much\nToo much\nSpace, too much\nToo much\n\nThere is a vast void,\nin space\nThat is my home`
      },
      {
        type: `short`,
        text: `It has been said that all that is void is void`
      },
      {
        type: `short`,
        text: `It has been said that all \n\nall         have  just one \n\npoint of view`
      },
      {
        type: `long`,
        text: `It has been said that there is no such thing as 'sound' only 'being'; that we are all parts of the same universal\nforce, and that force and form are, in reality, an adaptation of the same universal essence.`
      }
    ]
  }
];

function getUtterance() {
  let utteranceGroup = _.sample(groups);
  let selectedUtterance = _.sample(utteranceGroup.options);
  selectedUtterance.prefix = utteranceGroup.prefix;

  return selectedUtterance;
}

export { getUtterance };
