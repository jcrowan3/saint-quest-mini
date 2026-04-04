import { Saint } from '../types';

export const saints: Saint[] = [
  {
    id: 'francis',
    name: 'St. Francis',
    fullName: 'St. Francis of Assisi',
    description: 'Known for his love of nature and peace, St. Francis showed courage and mercy to all creatures.',
    primaryVirtues: ['Courage', 'Mercy'],
    color: 'bg-green-600',
    quests: [
      {
        id: 'francis-1',
        title: 'The Wolf of Gubbio',
        story: 'In the town of Gubbio, a fierce wolf terrorized the people, attacking anyone who ventured outside the city walls. Everyone lived in fear. But Francis did something unexpected—he walked out to meet the wolf, unarmed and unafraid. When he found the wolf, Francis spoke to it gently: "Brother Wolf, you have done much harm, but I know you are hungry. If the people feed you, will you stop your attacks?" The wolf bowed its head. Francis made peace between the wolf and the townspeople, and the wolf never harmed anyone again.',
        challenge: {
          id: 'francis-1-challenge',
          type: 'dilemma',
          question: 'A classmate is being mean to others because they feel left out. How do you respond with mercy like St. Francis?',
          options: [
            'Ignore them and stay away',
            'Tell the teacher immediately',
            'Try to understand why they\'re hurting and include them',
            'Be mean back to show them how it feels'
          ],
          correctAnswer: 2,
          explanation: 'St. Francis showed us that mercy means understanding the hurt behind someone\'s actions and responding with love, not fear or revenge.'
        },
        rewards: [
          { virtue: 'Mercy', points: 2 },
          { virtue: 'Courage', points: 1 }
        ]
      },
      {
        id: 'francis-2',
        title: 'Rebuilding the Church',
        story: 'One day while praying, Francis heard God say, "Rebuild my church." Francis thought God meant the small, crumbling chapel of San Damiano. So he sold some of his father\'s expensive cloth to buy stones for repairs. His father was furious! He dragged Francis before the bishop, demanding his money back. Francis gave back not just the money, but all his fine clothes too. Standing in the town square, Francis said, "Until now I called you father. Now I say only \'Our Father who art in heaven.\'" He chose a life of poverty to serve God.',
        challenge: {
          id: 'francis-2-challenge',
          type: 'trivia',
          question: 'What did St. Francis give up to follow God more closely?',
          options: [
            'His favorite toys',
            'His wealth and comfortable life',
            'His friends',
            'His family home'
          ],
          correctAnswer: 1,
          explanation: 'St. Francis gave up his wealth and the comfortable life his family provided, choosing instead to live simply and serve God and the poor.'
        },
        rewards: [
          { virtue: 'Courage', points: 2 },
          { virtue: 'Faith', points: 1 }
        ]
      },
      {
        id: 'francis-3',
        title: 'The Canticle of Creation',
        story: 'Near the end of his life, Francis was sick and nearly blind. Instead of complaining, he wrote a beautiful prayer called the "Canticle of the Sun." In it, he praised God for Brother Sun, Sister Moon, Brother Wind, Sister Water, and even Sister Death. He saw all of creation as his family, and he thanked God for every gift—even his suffering. Francis taught us that everything in the world is connected, and we should care for all of God\'s creation with love and gratitude.',
        challenge: {
          id: 'francis-3-challenge',
          type: 'memory',
          question: 'Match St. Francis\'s teachings with what he called parts of creation:',
          options: [
            'Brother Sun - gives us warmth and light',
            'Sister Moon - shines in the darkness',
            'Brother Wind - brings fresh air',
            'Sister Water - gives us life'
          ],
          correctAnswer: 0,
          explanation: 'St. Francis saw all of creation as a family, praising God through the sun, moon, wind, water, and earth. He teaches us to care for our common home.'
        },
        rewards: [
          { virtue: 'Wisdom', points: 2 },
          { virtue: 'Mercy', points: 1 }
        ]
      }
    ]
  },
  {
    id: 'paul',
    name: 'St. Paul',
    fullName: 'St. Paul the Apostle',
    description: 'Once a persecutor of Christians, St. Paul became one of the greatest teachers of faith and wisdom.',
    primaryVirtues: ['Faith', 'Wisdom'],
    color: 'bg-blue-600',
    quests: [
      {
        id: 'paul-1',
        title: 'The Road to Damascus',
        story: 'Saul was a fierce enemy of Christians. He traveled from town to town, arresting anyone who followed Jesus. One day, while riding to Damascus to arrest more believers, a brilliant light from heaven suddenly surrounded him. Saul fell to the ground and heard a voice: "Saul, Saul, why do you persecute me?" "Who are you, Lord?" Saul asked. "I am Jesus, whom you are persecuting," the voice replied. The light blinded Saul for three days. When his sight returned, he was a changed man—he became Paul, the great apostle who spread the Gospel across the world.',
        challenge: {
          id: 'paul-1-challenge',
          type: 'dilemma',
          question: 'You realize you\'ve been wrong about something important. What\'s the wisest choice?',
          options: [
            'Pretend you were right all along',
            'Admit your mistake and change direction',
            'Blame someone else for misleading you',
            'Keep doing what you were doing'
          ],
          correctAnswer: 1,
          explanation: 'Like St. Paul, wisdom means being humble enough to admit when we\'re wrong and having the courage to change.'
        },
        rewards: [
          { virtue: 'Faith', points: 2 },
          { virtue: 'Wisdom', points: 1 }
        ]
      },
      {
        id: 'paul-2',
        title: 'Letters of Encouragement',
        story: 'Paul traveled thousands of miles, often on foot, to bring the Good News of Jesus to new cities. When he couldn\'t visit communities in person, he wrote letters to encourage them. These letters, full of wisdom and love, became part of the Bible! In one famous letter, Paul wrote: "Love is patient, love is kind. It does not envy, it does not boast... Love never fails." His words continue to inspire people today, teaching us how to live with faith and love.',
        challenge: {
          id: 'paul-2-challenge',
          type: 'trivia',
          question: 'How did St. Paul spread the message of Jesus when he couldn\'t visit in person?',
          options: [
            'He sent messengers',
            'He wrote letters that became part of the Bible',
            'He stopped teaching',
            'He waited until he could travel'
          ],
          correctAnswer: 1,
          explanation: 'St. Paul wrote powerful letters to encourage early Christian communities. Many of these letters are now books of the New Testament!'
        },
        rewards: [
          { virtue: 'Wisdom', points: 2 },
          { virtue: 'Faith', points: 1 }
        ]
      },
      {
        id: 'paul-3',
        title: 'Faith Through Suffering',
        story: 'Paul\'s life as a missionary was not easy. He was beaten, shipwrecked, imprisoned, and rejected. Yet he never gave up. From a dark prison cell, Paul wrote some of his most joyful letters: "Rejoice in the Lord always! I will say it again: Rejoice!" Paul knew that real joy doesn\'t come from comfort—it comes from faith in God. Even when times were hard, Paul trusted that God had a plan. His faith remained unshakable.',
        challenge: {
          id: 'paul-3-challenge',
          type: 'dilemma',
          question: 'When facing a difficult challenge, what does St. Paul\'s example teach us?',
          options: [
            'Give up if it\'s too hard',
            'Complain about how unfair it is',
            'Trust in God and keep going with joy',
            'Only do what\'s easy and comfortable'
          ],
          correctAnswer: 2,
          explanation: 'St. Paul shows us that faith means trusting God even in hard times, and finding joy not in comfort but in doing God\'s will.'
        },
        rewards: [
          { virtue: 'Faith', points: 2 },
          { virtue: 'Courage', points: 1 }
        ]
      }
    ]
  },
  {
    id: 'therese',
    name: 'St. Thérèse',
    fullName: 'St. Thérèse of Lisieux',
    description: 'The "Little Flower" who showed that small acts of love done with great faith can change the world.',
    primaryVirtues: ['Mercy', 'Faith'],
    color: 'bg-pink-600',
    quests: [
      {
        id: 'therese-1',
        title: 'The Little Way',
        story: 'Thérèse grew up in France and entered a convent when she was just 15 years old. She wanted to do great things for God, but her life was quiet and simple. Then she discovered what she called the "Little Way"—doing small, everyday tasks with extraordinary love. Whether she was washing dishes, praying, or smiling at a difficult sister, Thérèse did everything as an act of love for Jesus. She wrote: "I will spend my heaven doing good on earth." Her little way became her path to sainthood.',
        challenge: {
          id: 'therese-1-challenge',
          type: 'dilemma',
          question: 'How can you practice St. Thérèse\'s "Little Way" today?',
          options: [
            'Do something big and impressive',
            'Only help when people notice',
            'Do small, kind acts with great love',
            'Wait for a special opportunity'
          ],
          correctAnswer: 2,
          explanation: 'St. Thérèse teaches us that holiness is found in doing ordinary things with extraordinary love—even when no one is watching.'
        },
        rewards: [
          { virtue: 'Mercy', points: 2 },
          { virtue: 'Faith', points: 1 }
        ]
      },
      {
        id: 'therese-2',
        title: 'Love for the Difficult Sister',
        story: 'In the convent, there was one sister who annoyed Thérèse greatly. Everything this sister did bothered her—the way she clicked her rosary beads, the sounds she made, even the way she walked. But instead of avoiding her or complaining, Thérèse chose to love her. She smiled at her, helped her, and treated her with kindness. The sister never knew that Thérèse found her difficult. Years later, the sister said Thérèse was one of the kindest people she had ever known. Thérèse had turned her frustration into an act of love.',
        challenge: {
          id: 'therese-2-challenge',
          type: 'trivia',
          question: 'What did St. Thérèse do when someone annoyed her?',
          options: [
            'She complained to others',
            'She avoided the person',
            'She chose to love them even more',
            'She asked to move away'
          ],
          correctAnswer: 2,
          explanation: 'St. Thérèse chose to respond to annoyance with extra kindness and love, turning a challenge into an opportunity for holiness.'
        },
        rewards: [
          { virtue: 'Mercy', points: 2 },
          { virtue: 'Wisdom', points: 1 }
        ]
      },
      {
        id: 'therese-3',
        title: 'Shower of Roses',
        story: 'As Thérèse was dying from tuberculosis at age 24, she made a promise: "I will spend my heaven doing good on earth. I will let fall a shower of roses." After her death, people who prayed to her began experiencing miracles and receiving roses as signs of her intercession. Her autobiography, "Story of a Soul," spread across the world, inspiring millions. Today, St. Thérèse is known as one of the greatest saints, proving that even a short, hidden life can have eternal impact when lived with faith and love.',
        challenge: {
          id: 'therese-3-challenge',
          type: 'memory',
          question: 'What symbol is associated with St. Thérèse?',
          options: [
            'Roses - her promise to send blessings from heaven',
            'Lilies - representing her purity',
            'Stars - representing her wisdom',
            'Doves - representing peace'
          ],
          correctAnswer: 0,
          explanation: 'St. Thérèse promised to let fall a "shower of roses" from heaven, and roses have become her special symbol of intercession and blessing.'
        },
        rewards: [
          { virtue: 'Faith', points: 2 },
          { virtue: 'Mercy', points: 1 }
        ]
      }
    ]
  },
  {
    id: 'carlo',
    name: 'St. Carlo Acutis',
    fullName: 'Blessed Carlo Acutis',
    description: 'A young computer programmer who used technology to spread faith and showed wisdom beyond his years.',
    primaryVirtues: ['Wisdom', 'Faith'],
    color: 'bg-indigo-600',
    quests: [
      {
        id: 'carlo-1',
        title: 'A Normal Kid with an Extraordinary Heart',
        story: 'Carlo Acutis was born on May 3, 1991, in London, but grew up in Milan, Italy. From the outside, he seemed like any other kid—he loved playing soccer with his friends, even though he wasn\'t very good at it. He enjoyed video games, especially on his PlayStation and Game Boy. He played the saxophone, made funny videos of his dogs, and laughed with his classmates. But something was different about Carlo. When he received his First Communion at age 7, he fell deeply in love with Jesus in the Eucharist. From that day on, he wanted to go to Mass every single day. His mom, who wasn\'t very religious at the time, was surprised. "Why do you want to go so often?" she asked. Carlo smiled and said, "The Eucharist is my highway to heaven. The more we receive Jesus, the more we become like Him." Even as a young boy, Carlo understood something profound: that being close to Jesus would change everything.',
        challenge: {
          id: 'carlo-1-challenge',
          type: 'dilemma',
          question: 'Carlo loved normal things like games and sports, but he also made Jesus his priority. What does this teach us?',
          options: [
            'You can\'t have fun if you want to be holy',
            'Being a saint means giving up everything you enjoy',
            'You can love normal things AND put God first',
            'Only boring people can become saints'
          ],
          correctAnswer: 2,
          explanation: 'Carlo shows us that holiness isn\'t about being weird or giving up fun—it\'s about making sure Jesus is at the center of everything we do. You can love sports, games, and friends while still loving God most of all.'
        },
        rewards: [
          { virtue: 'Faith', points: 2 },
          { virtue: 'Wisdom', points: 1 }
        ]
      },
      {
        id: 'carlo-2',
        title: 'One Hour a Week',
        story: 'When Carlo turned 8, he got something he had been wanting for a long time: a PlayStation. He was so excited! He loved playing games like Pokémon, Super Mario, and later even games like Halo. Gaming was fun, and Carlo enjoyed it. But Carlo noticed something. Some of his friends would play video games for hours and hours every day. They would skip homework, ignore their families, and think about nothing but the next level or the next game. Carlo realized that video games could be fun—but they could also become an addiction that took over your life. So Carlo made a decision that shocked his friends: he would only play video games for one hour per week. Just one hour! His friends thought he was crazy. "Carlo, why don\'t you play more? You have the games right there!" But Carlo knew the truth. He said, "If I spend all my time on games, I won\'t have time for the things that really matter—prayer, helping others, and spending time with Jesus." Carlo wanted to be in control of his choices, not controlled by a screen.',
        challenge: {
          id: 'carlo-2-challenge',
          type: 'dilemma',
          question: 'You love playing video games or being on your phone, but you notice it\'s taking up a lot of your time. What would Carlo do?',
          options: [
            'Keep playing as much as you want—it\'s just for fun',
            'Set a limit so you have time for other important things',
            'Quit completely and never have fun again',
            'Only play when no one is watching'
          ],
          correctAnswer: 1,
          explanation: 'Carlo didn\'t say video games were bad—he played them too! But he knew that self-control and balance were important. He chose to limit his gaming so he could use his time wisely for prayer, family, friends, and helping others.'
        },
        rewards: [
          { virtue: 'Wisdom', points: 2 },
          { virtue: 'Courage', points: 1 }
        ]
      },
      {
        id: 'carlo-3',
        title: 'Tupperware and Sleeping Bags',
        story: 'Every day on his way to school, Carlo would pass by the same homeless man sitting outside the church. Most people walked right past without even looking. But Carlo always stopped. He would smile, say hello, and sometimes sit and talk with him. At home, Carlo started packing extra food in Tupperware containers. "Mom, can I bring this to the man outside the church?" he would ask. His mother was amazed by his compassion. Carlo didn\'t just bring food once—he did it regularly. He used his weekly allowance, money that most kids would spend on toys or snacks, to buy sleeping bags for people who had nowhere to sleep. On cold Milan nights, Carlo would walk the streets with his parents, handing out warm sleeping bags to those who were suffering. His friends didn\'t always understand. "Why do you care so much about them?" they would ask. Carlo would respond, "Jesus is in each one of them. When I help them, I\'m helping Jesus." Carlo spent more time serving the poor than he ever spent playing video games. He saw every person as a child of God, deserving of love and dignity.',
        challenge: {
          id: 'carlo-3-challenge',
          type: 'dilemma',
          question: 'You see a homeless person on the street. What does Carlo\'s example encourage you to do?',
          options: [
            'Ignore them and keep walking',
            'Feel bad but do nothing',
            'See Jesus in them and find a way to help',
            'Judge them for being homeless'
          ],
          correctAnswer: 2,
          explanation: 'Carlo saw Jesus in every person, especially the poor and forgotten. He didn\'t just feel sorry for them—he actually helped with his time, his money, and his love. Even small acts of kindness can make a huge difference.'
        },
        rewards: [
          { virtue: 'Mercy', points: 3 },
          { virtue: 'Faith', points: 1 }
        ]
      },
      {
        id: 'carlo-4',
        title: 'Teaching Himself to Code',
        story: 'Carlo loved computers, but not just for playing games. He was fascinated by how they worked. While other kids his age were just using technology, Carlo wanted to understand it and create with it. So he taught himself to code. He started learning programming languages like C and C++, reading books, watching tutorials, and practicing on his computer for hours. It wasn\'t always easy—coding can be frustrating when things don\'t work. But Carlo was patient and persistent. Why did he want to learn? Because he had a vision. He saw that the internet could be used for good or for evil. Most people used it for entertainment or to waste time. But Carlo wanted to use it to bring people closer to God. He dreamed of building websites that would teach people about the faith, inspire them to pray, and help them fall in love with Jesus. And he did exactly that. Carlo used his skills to help parishes and Church organizations get online. He wasn\'t coding just to make money or to show off—he was coding for the Kingdom of God.',
        challenge: {
          id: 'carlo-4-challenge',
          type: 'trivia',
          question: 'Why did Carlo teach himself computer programming?',
          options: [
            'To make money and become famous',
            'To beat his friends at video games',
            'To use technology to bring people closer to God',
            'Because his parents made him'
          ],
          correctAnswer: 2,
          explanation: 'Carlo saw technology as a tool that could be used for God\'s glory. He learned to code so he could create websites and projects that would help people grow in faith and learn about Jesus.'
        },
        rewards: [
          { virtue: 'Wisdom', points: 2 },
          { virtue: 'Faith', points: 1 }
        ]
      },
      {
        id: 'carlo-5',
        title: 'The Eucharistic Miracles Project',
        story: 'At age 11, Carlo had an idea that would change thousands of lives. He had been learning about Eucharistic miracles—amazing events throughout history where the Eucharist (the consecrated bread and wine) physically turned into real flesh and blood, proving that Jesus is truly present. Carlo was fascinated. He wondered, "How many of these miracles have happened? Does anyone know about them?" So Carlo started researching. He read books, searched online, contacted parishes around the world, and gathered information about every documented Eucharistic miracle he could find. Then, using his coding skills, he built a website to display them all. He organized the miracles by country, added photos, wrote descriptions, and created a virtual exhibition that people could explore. It took months of hard work—researching, writing, designing, coding, testing. But Carlo didn\'t give up. When the website launched, it spread like wildfire. Parishes around the world started using it. Thousands of people visited the site and learned about these incredible miracles. Some people even came back to the faith because of what they saw. Carlo had used his talents—his love of technology, his patience, his creativity—to create something that glorified God and helped souls. He was only 11 years old.',
        challenge: {
          id: 'carlo-5-challenge',
          type: 'dilemma',
          question: 'You have a talent or skill that you\'re good at. What would Carlo encourage you to do with it?',
          options: [
            'Use it only to make yourself look good',
            'Hide it because you\'re afraid of failing',
            'Use it to serve God and help others',
            'Only use it when someone pays you'
          ],
          correctAnswer: 2,
          explanation: 'Carlo used his gifts not for himself, but for God and others. Whatever talent you have—art, music, sports, writing, math—God gave it to you for a reason. Use it to make the world better and bring people closer to Jesus.'
        },
        rewards: [
          { virtue: 'Wisdom', points: 2 },
          { virtue: 'Faith', points: 2 }
        ]
      },
      {
        id: 'carlo-6',
        title: 'Bad at Soccer, Great at Friendship',
        story: 'Carlo loved playing soccer with his friends after school. There was just one problem: he wasn\'t very good at it. In fact, his mom later said he was "quite bad" at soccer. He would miss easy passes, trip over the ball, and rarely scored goals. Some kids might have quit, embarrassed by their lack of skill. But not Carlo. He kept playing, week after week, because he understood something important: soccer wasn\'t really about being the best player. It was about friendship, teamwork, and having fun together. Carlo knew that if he stopped playing just because he wasn\'t great at it, he would miss out on time with his friends. And his friends loved having him there—not because he was talented, but because he was kind, encouraging, and always had a smile on his face. He would cheer when others scored, laugh when he messed up, and never take the game too seriously. Carlo taught his friends that it\'s okay to not be perfect. What matters is showing up, trying your best, and loving the people around you.',
        challenge: {
          id: 'carlo-6-challenge',
          type: 'dilemma',
          question: 'You\'re not very good at something, but your friends want you to join them. What does Carlo\'s example teach you?',
          options: [
            'Only do things you\'re already good at',
            'Quit because you might embarrass yourself',
            'Try anyway—friendship and fun matter more than being perfect',
            'Make excuses and avoid it'
          ],
          correctAnswer: 2,
          explanation: 'Carlo shows us that courage isn\'t just about doing hard things—it\'s also about being okay with not being the best. He valued friendship and joy over pride and perfection. It\'s okay to be bad at something if it means being with people you care about.'
        },
        rewards: [
          { virtue: 'Courage', points: 2 },
          { virtue: 'Mercy', points: 1 }
        ]
      },
      {
        id: 'carlo-7',
        title: 'Standing Up for the Bullied',
        story: 'At school, Carlo noticed something that bothered him. Some of his classmates were being bullied. They were teased, left out, and made fun of because they were different—maybe they were quieter, dressed differently, or didn\'t fit in with the "cool" crowd. Most students just watched and did nothing. Some even joined in with the teasing because they didn\'t want to become targets themselves. But Carlo did something different. When he saw someone being picked on, he stepped in. He would sit with the kid who ate lunch alone. He would invite the excluded classmate to join his group. He would speak up and say, "That\'s not cool," when he heard someone making fun of another person. It wasn\'t always easy. Some of his friends didn\'t understand why he cared so much. But Carlo knew what Jesus would do—Jesus always defended the weak, the forgotten, and the rejected. Carlo also taught catechism to younger children at his parish. He was patient, kind, and made learning about God fun. He saw every person—young or old, popular or unpopular—as someone precious to God. And he treated them that way.',
        challenge: {
          id: 'carlo-7-challenge',
          type: 'dilemma',
          question: 'You see someone being bullied or left out at school. What would Carlo do?',
          options: [
            'Stay quiet to avoid getting bullied yourself',
            'Join in with the teasing to fit in',
            'Stand up for them and show them kindness',
            'Feel bad but do nothing'
          ],
          correctAnswer: 2,
          explanation: 'Carlo had the courage to stand up for those who were weak and rejected. He knew that true strength is using your voice and actions to protect and love others, even when it\'s uncomfortable. Jesus calls us to defend those who can\'t defend themselves.'
        },
        rewards: [
          { virtue: 'Courage', points: 2 },
          { virtue: 'Mercy', points: 2 }
        ]
      },
      {
        id: 'carlo-8',
        title: 'Offering Everything to God',
        story: 'In October 2006, when Carlo was just 15 years old, he started feeling sick. At first, it seemed like a normal illness, but the doctors soon discovered the terrible truth: Carlo had leukemia, a serious form of cancer. The news was devastating. Carlo\'s parents were heartbroken. His friends couldn\'t believe it. But Carlo? Carlo had a surprising reaction. He wasn\'t angry at God. He didn\'t ask, "Why me?" Instead, he did something incredible: he offered his suffering as a gift to God. He said, "I offer all my suffering for the Pope and for the Church." Carlo understood that suffering, when united with Jesus on the cross, could bring grace and healing to others. Even as the illness got worse, Carlo remained joyful. He continued to pray, to smile, and to encourage those around him. In his final days, he said something that would echo around the world: "I\'m happy to die because I lived my life without wasting even a minute on things that don\'t please God." On October 12, 2006, Carlo passed away peacefully, surrounded by his family. But his story didn\'t end there. His life inspired millions. In 2020, he was beatified, one step away from sainthood. Today, Carlo Acutis is on his way to becoming the first millennial saint—a reminder that holiness isn\'t about living a long life, but about living a life full of love.',
        challenge: {
          id: 'carlo-8-challenge',
          type: 'dilemma',
          question: 'When facing something really difficult or painful, what does Carlo\'s example teach us?',
          options: [
            'Get angry and ask "Why is this happening to me?"',
            'Give up on God because life is unfair',
            'Offer your suffering to God and trust that He can use it for good',
            'Pretend everything is fine and ignore the pain'
          ],
          correctAnswer: 2,
          explanation: 'Carlo shows us that even suffering can have meaning when we offer it to God. He trusted that God could use even his pain to bring grace to others. This kind of faith turns our hardest moments into acts of love.'
        },
        rewards: [
          { virtue: 'Faith', points: 3 },
          { virtue: 'Courage', points: 2 }
        ]
      }
    ]
  }
];

export const getSaintById = (id: string): Saint | undefined => {
  return saints.find(saint => saint.id === id);
};
