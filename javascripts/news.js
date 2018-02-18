var newsArray = ["TODO: consider removing news", "9 = 3^2, so the third dimension can't exist. Wait, what?",
"Did you really think I would steal the messages that someone took so much work to make? I\'d never outright steal something that someone put so much effort into, no matter what the license was.",
"May the Heavenly Pelle punish me only lightly (both for stealing game code and for adding the 9th dimension).",
"I would sacrifice to the 9th dimension, but I'm not sure how. It certainly doesn't help that I removed the feature of Dimensional Sacrifice.", "Is False Antimatter just null matter?",
"I have something more important to do than finishing writing up th",
"Tip: let Challenge 3 run for a day and don't shift. You can't do much to help it, so you might actually be productive that day.",
"Dear me from the future: if you have time travel, send an email to me now giving me development help. *checks email*",
"13th dimension is a lie", "Ia! Ia! 9D fhtagn!", "I don't need to test because it will magically work. This apparent 'syntax error' is just a test of my faith.",
"JavaScript vs this game's code: which has more warts? No one knows.",
"What the hell, Hevipelle?", "Maybe if I initialize the achievements in both these places it will magically work. You'll know it worked if they start grey and turn green when you get them, rather than the reverse.",
"I just started making this game and I have no idea how to do the Hyper Autobuyer Challenge. It might well be impossible.",
"The challenges are balanced the same way a scale with an elephant on one side and a mouse on the other is balanced.",
"My strategy for removing features I don't want: just remove them and hope I won't decide that I should add them again.",
"Right after getting a Second Dimension, the number of First Dimensions starts diverging from the number of First Dimensions bought. This is a known bug and will be fixed in the next version.",
"16D should be enough for anyone.", "I somehow managed to cause the game both to only have 3 dimensions initially and to not have a dimensional shift button. This was, as you would expect, very un-four-tunate.",
"Cancer notation has started using random characters rather than emoji for some encoding reason, but given its intent this seems fine.",
"Cool. Cool cool cool - me upon seeing the 9th dimension work.", "challenge_messages",
"I abbreviated my variables and now I have a headache. Maybe it's because the code is unclear, but maybe it's because of this msg.",
"Did you know? The original game does have a ninth dimension, but it has a huge unlock requirement and no associated challenge, so is not super useful. On the other hand, maybe I'm just trying to dash your hopes here.",
"May the Fourth Dimension be with you.",
"You thought the long message in the original game was annoying? This one is even more annoying! It goes on forever and ever and never stops, " +
"and even reloading won't remove it. There is no way to avoid this long message, refreshing will not help, the best one can hope for is to live with it, " +
"and that isn't even always possible since it will sometimes randomly crash the game as a side-effect. The only thing that could stop my evil plan of " +
"making this the only message is if there were some sort of character l",
"Breaking news! The original version of Antimatter Dimensions is updating in just five hours!",
"Due to my inefficient coding (not the original author's), going to the infinity upgrades tab will slow down the game. (This may have magically fixed itself, but I'm wary of such things.) I know that a lot of these news messages are just intended to be silly, but this one is an actual announcement. " +
"You don't need to go to that tab too much, though.",
"Infinity tab has magically stopped lagging! Wonderful!",
"Good news: I found a bug that lets you get the time reward from \"One for each dimension\" early. Bad news: before a day has passed it's bad to have this \"reward\".",
"I think soon enough this game will stop being AD with more dimensions and become the first AD-like.",
"13th dimension is a lie the same way the cake is a lie: it fails to show up for a long time, then it appears, and that's more or less the end of the game.",
"If the news array in news.js gets to 50 lines, then Fake News will require 50 news messages, as in the original game.",
"I was changing various occurances of player.resets to player.shiftResets. I realized that I replaced one occurance of player.resets with shiftResets() accidentally, but only after I moved onto the next. I used shift-enter to get back to my mistake. Then the whole file deleted itself. I wonder why...",
"I removed the wonderful quadratic formula used to buy max. I think, given that I increase dimension costs linearly, it could probably be fixed, but that seems like a bad use of time. So if you have 1e100000 antimatter and your Buy Max is lagging, blame me.",
"I have a strategy of automating leverage maximization with a simple machine learning algorithm. What that means is that I used a lever to hold down Buy Max without me doing anything other than the setup, and figured out how to do so by the algorithm of learning about the relevant topic " +
"(here, \"simple machines\") by reading the Wikipedia article.",
"Challenge 12 is worse than you think. Do not expect to finish it until the sun goes supernova (and yes, I know that a supernova is not how the sun will die).",
"In reality, False Antimatter Dimensions is just a fad.",
"Cheatsheet for the original game's code: challenge1 is First Dimension, challenge2 is Second Dimenion, challenge3 is Third Dimension, " +
"challenge4 is Dimension Boosts, challenge5 is Tickspeed, challenge6 is Fifth Dimension, " +
"challenge7 is Big Crunch, challenge8 is Fourth Dimension, challenge9 is Seventh Dimension, " +
"challenge10 is Sixth Dimension, challenge11 is Eighth Dimension, and challenge12 is Galaxies.",
"Challenge 6 has about the right level of difficulty, but is somewhat different than in the original game. It's very surprising when that happens.",
"There's a Tickspeed Challenge python helper in the github repository.",
"Most of these news messages are about challenges. All I can say is that coming up with good news messages is challenging.",
"I'm trying to test Challenge 15 but I have so many bonuses that it's taking forever to reset.",
"Oh, so that's how long eternity is - Literally nobody more than once",
"There is a known bug in which the Hyper Challenge only counts the time of the second part. This is not high-priority.",
"Issue #15: bug reports mysteriously end up in the news array. Closed: could not be replicated. Please report if you see this issue in the wild.",
"I tried to break infinity and was able to eternity in roughly three infinities. Thus, I conclude that breaking infinity is broken.",
"The news array has only 49 messages and FAKE NEWS requires 50. I wonder how I'll fix this?",
"Press F to pay antimatter for 15th dimension",
"Now featuring Iroha notation! Learn hiragana (or else be confused)!"];

var specialNews = {
  'challenge_messages': [
    "I'm trying to get the first challenge to work. Things are going as usual.",
    "I'm trying to get the second challenge to work. Things are speeding up.",
    "I'm trying to get the third challenge to work. It seems like it will take a long time.",
    "I'm trying to get the fourth challenge to work. Some parts of it seem to keep returning to their state before I did anything.",
    "I'm trying to get the fifth challenge to work. I'm not working as quickly as I expected.",
    "I'm trying to get the sixth challenge to work. Each change seems to require partial reversion of an earlier change.",
    "I'm trying to get the seventh challenge to work. Wish me luck!",
    "I'm trying to get the eighth challenge to work. I need a boost.",
    "I'm trying to get the ninth challenge to work. My goal is to make it fair and square.",
    "I'm trying to get the tenth challenge to work. My goals are so far away.",
    "I'm trying to get the eleventh challenge to work. There's only a certain amount I can do, though.",
    "I'm trying to get the dozenth challenge to work. I'm making sure the decth dimension is the highest you can go."
  ]
};
