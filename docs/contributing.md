# Contributing

First off, thank you for considering contributing towards Dashy! 🙌
There are several ways that you can help out, and any contributions, however small will always be very much appreciated.
You will be appropriately credited in the readme - huge thank you to [everyone who has helped](/docs/credits.md) so far 💞

## Take a 2-minute survey
Help improve Dashy by taking a very short, 6-question survey. This will give me a better understanding of what is important to you, so that I can make Dashy better in the future :)

[![Take the Survey](https://img.shields.io/badge/Take_the-Survey-%231a86fd?style=for-the-badge&logo=buddy)](https://survey.typeform.com/to/gl0L68ou)

## Share your dashboard
Dashy now has a [Showcase](https://github.com/Lissy93/dashy/blob/master/docs/showcase.md#dashy-showcase-) where you can show off a screenshot of your dashboard, and get inspiration from other users (and I really love seeing how people are using Dashy). To [submit your dashboard](https://github.com/Lissy93/dashy/blob/master/docs/showcase.md#submitting-your-dashboard), either open a PR or raise an issue.

[![Add your Dashboard to the Showcase](https://img.shields.io/badge/Add_your_Dashboard-Showcase-%238616ee?style=for-the-badge&logo=feathub&logoColor=8616ee)](https://github.com/Lissy93/dashy/issues/new?assignees=&labels=%F0%9F%92%AF+Showcase&template=showcase-addition.yml&title=%5BSHOWCASE%5D+%3Ctitle%3E)

## Make a small donation

Donations help to cover server costs, development time and caffeine ;)
Don't feel any pressure to donate anything, as Dashy and my other projects will always be 100% free, for everyone, for ever.

[![Sponsor Lissy93 on GitHub](https://img.shields.io/badge/Sponsor_on_GitHub-Lissy93-%23ff4dda?style=for-the-badge&logo=githubsponsors&logoColor=ff4dda)](https://github.com/sponsors/Lissy93)

Sponsoring will give you several perks - for $1 / £0.75 per month, you'll get a sponsor badge on your profile, be credited on the Dashy's readme, with a link to your website/ profile/ socials, get priority support,  have your feature ideas implemented, plus lots more. For more info, see [@Lissy93's Sponsor Page](https://github.com/sponsors/Lissy93).

<details>
	<summary>You can also send a one-off small contribution using crypto</summary>
	<p>

[![Donate with BTC](https://en.cryptobadges.io/badge/big/3853bSxupMjvxEYfwGDGAaLZhTKxB2vEVC)](https://en.cryptobadges.io/donate/3853bSxupMjvxEYfwGDGAaLZhTKxB2vEVC)[![Donate with Ethereum](https://en.cryptobadges.io/badge/big/0x0fc98cBf8bea932B4470C46C0FbE1ed1f6765017)](https://en.cryptobadges.io/donate/0x0fc98cBf8bea932B4470C46C0FbE1ed1f6765017)

- **BTC**: `3853bSxupMjvxEYfwGDGAaLZhTKxB2vEVC`
- **ETH**: `0x0fc98cBf8bea932B4470C46C0FbE1ed1f6765017` / `aliciasykes.eth`
- **XMR**: `471KZdxb6N63aABR4WYwMRjTVkc1p1x7wGsUTEF7AMYzL8L94A5pCuYWkosgJQ5Ze8Y2PscVCGZFJa3hDPg6MaDq47GUm8r`
- **LTC**: `MAuck6Ea1qaNihwKfXutkR1R6BorMth86H`
- **ZEC**: `t1bw1SefijsXRDQVxC9w64XsRK8hBhtQohQ`

  </p>
</details>

## Enable Anonymous Bug Reports

Bug reports helps me to discover bugs I was unaware of, and then fix them, in order to make Dashy more reliable long term. This is a simple, yet really helpful step you can take to help improve Dashy. [Sentry](https://github.com/getsentry/sentry) is an open source error tracking and performance monitoring tool, which enables the identification any errors which occur in the production app (only if you enable it). 

To enable error reporting:
```yaml
appConfig:
  enableErrorReporting: true
```

All reporting is **disabled** by default, and no data will ever be sent to any external endpoint without your explicit consent. All statistics are anonomized and stored securely. For more about privacy and security, see the [Sentry Security Docs](https://sentry.io/security/).

## Add Translations
If you speak another language, then adding translations will help make Dashy available to non-native English speakers. This is a very quick and easy task, as all application text is located in [`locales/en.json`](https://github.com/Lissy93/dashy/blob/master/src/assets/locales/en.json), so adding a new language is as simple as copying this file and translating the values. You don't have to translate it all, as any missing attributes will just fallback to English. For a full tutorial, see the [Multi-Language Support Docs](https://github.com/Lissy93/dashy/blob/master/docs/multi-language-support.md).

## Submit a PR
Contributing to the code or docs is super helpful. You can fix a bug, add a new feature or improve an existing one. If you've built your own custom widget, theme or view, consider sharing it in a PR. I've written [several guides](/docs/development-guides.md) to help you get started, and the steps for setting up the development environment are outlined in the [Development Docs](/docs/developing.md). Feel free to ask if you have any questions.

## Improve the Docs
Found a typo, or something that isn't as clear as it could be? Maybe I've missed something off altogether, or you hit a roadblock that took you a while to figure out. Submitting a pull request to add to or improve the documentation will help future users get Dashy up and running more easily.
All content is located either in the [`./README.md`](/README.md) or [`/docs/`](/docs) directory, and synced to the Wiki and website using a GH [action](/actions/workflows/wiki-sync.yml).

## Raise a bug
If you've found a bug, then please do raise it as an issue. This will help me know if there's something that needs fixing. Try and include as much detail as possible, such as your environment, steps to reproduce, any console output and maybe an example screenshot or recording if necessary.

[![Raise a Bug](https://img.shields.io/badge/Raise_a-Bug-%23dc2d76?style=for-the-badge&logo=dependabot)](https://github.com/Lissy93/dashy/issues/new?assignees=lissy93&labels=%F0%9F%90%9B+Bug&template=bug.yml&title=%5BBUG%5D+%3Ctitle%3E)

## Join the discussion
I've enabled the discussion feature on GitHub, here you can share tips and tricks, useful information, or your dashboard. You can also ask questions, and offer basic support to other users.

[![Join the Discussion on GitHub](https://img.shields.io/badge/Join_the-Discussion-%23ffd000?style=for-the-badge&logo=livechat)](https://github.com/Lissy93/dashy/discussions)

## Request a feature via BountySource
BountySource is a platform for sponsoring the development of certain features on open source projects. If there is a feature you'd like implemented into Dashy, but either isn't high enough priority or is deemed to be more work than it's worth, then you can instead contribute a bounty towards it's development. You won't pay a penny until your proposal is fully built, and you are satisfied with the result. This helps support the developers, and makes Dashy better for everyone.

[![Request a Feature on BountySource](https://img.shields.io/badge/BountySource-Dashy-%23F67909?style=for-the-badge&logo=openbugbounty)](https://www.bountysource.com/teams/dashy)

## Spread the word
Dashy is still a relatively young project, and as such not many people know of it. It would be great to see more users, and so it would be awesome if you could consider sharing with your friends or on social platforms.

[![Share Dashy on Mastodon](https://img.shields.io/badge/Share-Mastodon-%232b90d9?style=flat-square&logo=mastodon)](https://mastodon.social/?text=Check%20out%20Dashy%2C%20the%20privacy-friendly%2C%20self-hosted%20startpage%20for%20organizing%20your%20life%3A%20https%3A%2F%2Fgithub.com%2FLissy93%2Fdashy%20-%20By%20%40lissy93%40mastodon.social)
[![Share Dashy on Reddit](https://img.shields.io/badge/Share-Reddit-%23FF5700?style=flat-square&logo=reddit)](http://www.reddit.com/submit?url=https://github.com/Lissy93/dashy&title=Dashy%20-%20The%20self-hosted%20dashboard%20for%20your%20homelab%20%F0%9F%9A%80)
[![Share Dashy on Twitter](https://img.shields.io/badge/Share-Twitter-%231DA1F2?style=flat-square&logo=twitter)](https://twitter.com/intent/tweet?url=https://github.com/lissy93/dashy&text=Check%20out%20Dashy%20by%20@Lissy_Sykes,%20the%20self-hosted%20dashboard%20for%20your%20homelab%20%F0%9F%9A%80)
[![Share Dashy on Facebook](https://img.shields.io/badge/Share-Facebook-%234267B2?style=flat-square&logo=facebook)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/lissy93/dashy)
[![Share Dashy on LinkedIn](https://img.shields.io/badge/Share-LinkedIn-%230077b5?style=flat-square&logo=linkedin)](https://www.linkedin.com/shareArticle?mini=true&url=https://github.com/lissy93/dashy)
[![Share Dashy on Pinterest](https://img.shields.io/badge/Share-Pinterest-%23E60023?style=flat-square&logo=pinterest)](https://pinterest.com/pin/create/button/?url=https://github.com/lissy93/dashy&media=https://raw.githubusercontent.com/Lissy93/dashy/master/docs/showcase/1-home-lab-material.png&description=Check%20out%20Dashy,%20the%20self-hosted%20dashboard%20for%20your%20homelab%20%F0%9F%9A%80)
[![Share Dashy on VK](https://img.shields.io/badge/Share-VK-%234C75A3?style=flat-square&logo=vk)](https://vk.com/share.php?url=https%3A%2F%2Fgithub.com%2Flissy93%2Fdashy%2F&title=Check%20out%20Dashy%20-%20The%20Self-Hosted%20Dashboard%20for%20your%20Homelab%20%F0%9F%9A%80)
[![Share Dashy via Viber](https://img.shields.io/badge/Share-Viber-%238176d6?style=flat-square&logo=viber)](viber://forward?text=https%3A%2F%2Fgithub.com%2Flissy93%2Fdashy%0ACheck%20out%20Dashy%2C%20the%20self-hosted%20dashboard%20for%20your%20homelab%20%F0%9F%9A%80)
[![Share Dashy via Telegram](https://img.shields.io/badge/Share-Telegram-%230088cc?style=flat-square&logo=telegram)](https://t.me/share/url?url=https%3A%2F%2Fgithub.com%2Flissy93%2Fdashy&text=Check%20out%20Dashy%2C%20the%20self-hosted%20dashboard%20for%20your%20homelab%20%F0%9F%9A%80)
[![Share Dashy via Email](https://img.shields.io/badge/Share-Email-%238A90C7?style=flat-square&logo=protonmail)](mailto:info@example.com?&subject=Check%20out%20Dashy%20-%20The%20self-hosted%20dashboard%20for%20your%20homelab%20%F0%9F%9A%80&cc=&bcc=&body=https://github.com/lissy93/dashy)

## Star, Upvote or Leave a Review
Dashy is on the following platforms, and if you could spare a few seconds to give it an upvote or review, this will also help new users discover Dashy

[![ProductHunt](https://img.shields.io/badge/Review-ProductHunt-%23b74424?style=flat-square&logo=producthunt)](https://www.producthunt.com/posts/dashy)
[![AlternativeTo](https://img.shields.io/badge/Review-AlternativeTo-%235581a6?style=flat-square&logo=abletonlive)](https://alternativeto.net/software/dashy/about/)
[![Slant](https://img.shields.io/badge/Review-Slant-%2346a1df?style=flat-square&logo=capacitor)](https://www.slant.co/improve/topics/27783/viewpoints/1/~self-hosted-homelab-startpage~dashy)
[![Star on GitHub](https://img.shields.io/github/stars/Lissy93/Dashy?color=ba96d6&label=Star%20-%20GitHub&logo=github&style=flat-square)](https://github.com/Lissy93/dashy/stargazers)
[![Star on DockerHub](https://img.shields.io/docker/stars/lissy93/dashy?color=4cb6e0&label=Star%20-%20Docker&logo=docker&style=flat-square)](https://hub.docker.com/r/lissy93/dashy)

## Follow for More
If you've enjoyed Dashy, you can follow the me to get updates about other projects that I am working on.

[![Alicia Sykes on Twitter](https://img.shields.io/twitter/follow/Lissy_Sykes?style=social&logo=twitter)](https://twitter.com/Lissy_Sykes)
[![Alicia Sykes on GitHub](https://img.shields.io/github/followers/lissy93?label=Lissy93&style=social)](https://github.com/Lissy93)
[![Alicia Sykes on Mastodon](https://img.shields.io/mastodon/follow/1032965?domain=https%3A%2F%2Fmastodon.social)](https://mastodon.social/web/accounts/1032965)
[![Alicia Sykes on Keybase](https://img.shields.io/badge/aliciasykes--lightgrey?style=social&logo=Keybase)](https://keybase.io/aliciasykes)
[![Alicia Sykes's Website](https://img.shields.io/badge/aliciasykes.com--lightgrey?style=social&logo=Tencent%20QQ)](https://aliciasykes.com)
[![Alicia Sykes's Blog](https://img.shields.io/badge/Blog--lightgrey?style=social&logo=micro.blog)](https://notes.aliciasykes.com/)
[![Alicia Sykes's PGP](https://img.shields.io/badge/PGP--lightgrey?style=social&logo=Let%E2%80%99s%20Encrypt)](https://keybase.io/aliciasykes/pgp_keys.asc)

If you like, you could also consider [subscribing to my mailing list](https://notes.aliciasykes.com/subscribe) for occasional blog post updates.

---

### Contributors

For a full list of Dashy's contributors, see the [Credits Page](/docs/credits.md)

[![Auto-generated contributors](https://raw.githubusercontent.com/Lissy93/dashy/master/docs/assets/CONTRIBUTORS.svg)](/docs/credits.md)

### Star-Gazers Over Time

[![Stargazers](https://starchart.cc/Lissy93/dashy.svg)](https://seladb.github.io/StarTrack-js/#/preload?r=Lissy93,dashy)

