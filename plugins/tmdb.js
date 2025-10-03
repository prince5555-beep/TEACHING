const axios = require('axios');

module.exports = {
  command: 'tmdb',
  description: '🎬 Get detailed info about a movie from TMDB',
  execute: async (socket, msg, args, number) => {
    const sender = msg.key.remoteJid;
    const tmdbKey = '0722e82e0335879fc3e6c85ab3687dc6'; // Replace with your TMDB API key

    const movieName = args.join(" ");
    if (!movieName) {
      return await socket.sendMessage(sender, {
        text: '🎬 Please provide a movie name.\n\nExample: `.tmdb inception`'
      });
    }

    try {
      const search = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(movieName)}`);
      const results = search.data.results;

      if (!results || results.length === 0) {
        return await socket.sendMessage(sender, {
          text: '❌ No movie found with that name.'
        });
      }

      const movie = results[0];
      const details = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbKey}`);
      const info = details.data;

      const title = info.title || "N/A";
      const poster = `https://image.tmdb.org/t/p/w500${info.poster_path}`;
      const rating = info.vote_average;
      const release = info.release_date;
      const genres = info.genres.map(g => g.name).join(", ");
      const runtime = `${info.runtime} minutes`;
      const overview = info.overview || "No overview available.";
      const tmdbLink = `https://www.themoviedb.org/movie/${info.id}`;

      const message = `🎬 *${title}*\n\n` +
                      `⭐ *Rating:* ${rating}/10\n` +
                      `🎭 *Genres:* ${genres}\n` +
                      `🗓 *Release Date:* ${release}\n` +
                      `⏱ *Runtime:* ${runtime}\n\n` +
                      `📖 *Overview:*\n${overview}\n\n` +
                      `🔗 *TMDB Link:* ${tmdbLink}`;

      await socket.sendMessage(sender, {
        image: { url: poster },
        caption: message
      });
    } catch (e) {
      console.error(e);
      await socket.sendMessage(sender, {
        text: '❌ Error while fetching movie details.'
      });
    }
  }
};
