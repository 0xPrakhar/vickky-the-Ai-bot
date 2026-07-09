export const commands = {
  name: "weather",
  description: "Get the current weather of a city",
  options: [
    {
      name: "city",
      description: "The city to get weather for",
      type: 3, // STRING type
      required: true
    }
  ]
};

export const execute = async (interaction) => {
  // Get the city the user typed
  const city = interaction.options.getString("city");

  // Build the request URL using your API key and the city name
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Send the request and wait for the response
    const response = await fetch(url);
    const data = await response.json();

    // Check if the city wasn't found (OpenWeatherMap returns cod: "404" on failure)
    if (data.cod !== 200) {
      await interaction.reply(`Sorry, I couldn't find weather for "${city}". Please check the spelling and try again.`);
      return;
    }

    // Pull out the useful info
    const temperature = data.main.temp;
    const feelsLike = data.main.feels_like;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;

    // Build and send the reply
    const replyText = `**Weather in ${city}**\n\n🌡️ Temperature: ${temperature}°C\n🤔 Feels like: ${feelsLike}°C\n☁️ Conditions: ${description}\n💧 Humidity: ${humidity}%`;

    await interaction.reply(replyText);

  } catch (error) {
    console.error(`Weather command error: ${error}`);
    await interaction.reply("Something went wrong while fetching the weather. Please try again later.");
  }
};