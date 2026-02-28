import puppeteer from "puppeteer";


type PlayerSummary = {
  LastName: string;
  FirstName: string;
  BirthDate: string;
  Age: number;
  ScRelativeUrlPlayerCountryFlag: string | null;
  Profile_pic: string;
  WeightLb: number;
  WeightKg: number;
  NatlId: string;
  Nationality: string;
  HeightIn: number;
  HeightFt: string;
  HeightCm: number;
};

export async function fetchATPPlayer(playerId: string) {
  const url = `https://www.atptour.com/en/-/www/players/hero/${playerId.slice(3)}?v=1`;

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );

  await page.goto(url, { waitUntil: "networkidle2" });

  const content = await page.content();

  const jsonDataMatch = content.match(/\{.*\}/s);
  const jsonData = jsonDataMatch ? JSON.parse(jsonDataMatch[0]) : null;

  await browser.close();


  jsonData['Profile_pic'] =`https://www.atptour.com/-/media/alias/player-headshot/${playerId.slice(3)}`
  jsonData['ScRelativeUrlPlayerCountryFlag'] = `https://www.atptour.com/${jsonData['ScRelativeUrlPlayerCountryFlag']}`
  return extractPlayerSummary(jsonData);
}

function extractPlayerSummary(player: any): PlayerSummary {
  return {
    Profile_pic: player.Profile_pic,
    LastName: player.LastName,
    FirstName: player.FirstName,
    BirthDate: player.BirthDate,
    Age: player.Age,
    ScRelativeUrlPlayerCountryFlag: player.ScRelativeUrlPlayerCountryFlag,
    WeightLb: player.WeightLb,
    WeightKg: player.WeightKg,
    NatlId: player.NatlId,
    Nationality: player.Nationality,
    HeightIn: player.HeightIn,
    HeightFt: player.HeightFt,
    HeightCm: player.HeightCm,
  };
}
