const fs = require("fs");

const username = "beautifulnight";

const query = `
query ($username: String) {
  User(name: $username) {
    name
    avatar {
      large
    }
    statistics {
      anime {
        count
        episodesWatched
        minutesWatched
      }
      manga {
        count
        chaptersRead
      }
    }
  }
}
`;

async function main() {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "AniListDiscordWidget/1.0"
    },
    body: JSON.stringify({
      query,
      variables: {
        username
      }
    })
  });

  const json = await response.json();

  if (!json.data?.User) {
    console.log(json);
    process.exit(1);
  }

  const user = json.data.User;

  const output = {
    username: user.name,
    avatar: user.avatar.large,
    animeCount: user.statistics.anime.count,
    episodesWatched: user.statistics.anime.episodesWatched,
    minutesWatched: user.statistics.anime.minutesWatched,
    mangaCount: user.statistics.manga.count,
    chaptersRead: user.statistics.manga.chaptersRead,
    updated: new Date().toISOString()
  };

  fs.writeFileSync(
    "anilist.json",
    JSON.stringify(output, null, 2)
  );
}

main();