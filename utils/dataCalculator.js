export function calculatePestIndex_v1({
  temp,
  humidity,
  rain = 0,
  rain7d = 0,
  wind = 0,
}) {
  if (temp === undefined || humidity === undefined) return null;

  // --- 1. Environmental Scoring (Biological Optimization) ---

  // Temperature: Most pests thrive between 25°C and 32°C.
  // Above 40°C, metabolic stress occurs. Below 15°C, many go dormant.
  const tempScore =
    temp < 10 ? 10 : temp < 18 ? 40 : temp <= 32 ? 100 : temp <= 38 ? 60 : 20;

  // Humidity: High humidity reduces desiccation risk (drying out).
  // Cockroaches and Termites are extremely sensitive to low humidity (<40%).
  const humidityScore = humidity < 30 ? 10 : humidity < 50 ? 50 : 100;

  // Rain: Standing water (rain7d) is better for mosquitoes than immediate heavy rain.
  // Heavy rain (>10mm) can actually wash away larvae.
  const rainScore = (() => {
    const combined = 0.3 * rain + 0.7 * (rain7d / 7);

    // If you want it to be 0 when there is no rain at all:
    if (combined === 0) return 0;

    if (combined < 2) return 40;
    if (combined < 5) return 70;
    return 100;
  })();

  // Wind: High wind prevents flying pests (mosquitoes/flies) from landing or searching.
  const windScore = wind < 4 ? 100 : wind < 12 ? 60 : 10;

  // --- 2. Pest Specific Impacts ---

  // Mosquitoes: High weight on standing water and low wind.
  const mosquito =
    0.3 * tempScore + 0.25 * humidityScore + 0.35 * rainScore + 0.1 * windScore;

  // Termites: Extremely dependent on soil moisture (RainScore) and temperature.
  const termite = 0.4 * tempScore + 0.6 * ((humidityScore + rainScore) / 2);

  // Cockroaches: Thrive in warm, humid environments. Rain drives them indoors.
  const cockroach =
    0.5 * tempScore + 0.3 * humidityScore + 0.2 * (rain > 0 ? 100 : 40);

  // Bedbugs: Mostly indoor-controlled, but high temp increases their breeding cycle speed.
  // Ambient temperature reduces egg-to-adult time from 21 days to 9 days.
  const bedbug = 0.8 * 60 + 0.2 * tempScore;

  // Rodents: Heavy rain (rainScore) floods burrows, forcing them into human structures.
  const rodent = 0.4 * tempScore + 0.6 * (rainScore > 70 ? 100 : 40);

  // --- 3. Normalization & PPI ---

  const normalize = (val) => {
    const score = Math.round(Math.max(0, Math.min(100, val)));
    const level =
      score < 25
        ? "Low"
        : score < 45
          ? "Moderate"
          : score < 75
            ? "High"
            : "Very High";
    return { score, level };
  };

  const pests = {
    mosquito: normalize(mosquito),
    cockroach: normalize(cockroach),
    termite: normalize(termite),
    fly: normalize(0.5 * tempScore + 0.3 * humidityScore + 0.2 * windScore),
    rodent: normalize(rodent),
    bedbug: normalize(bedbug),
  };

  const pestArray = Object.entries(pests).map(([name, details]) => ({
    name,
    ...details,
    icon: `/pests/${name}.png`,
  }));

  // PPI (Overall Index) weighted towards high-impact pests (Termites/Mosquitoes)
  const ppiValue =
    pests.termite.score * 0.3 +
    pests.mosquito.score * 0.3 +
    pests.cockroach.score * 0.2 +
    pests.rodent.score * 0.2;

  return {
    pests: pestArray,
    ppi: normalize(ppiValue),
    environment: { tempScore, humidityScore, rainScore, windScore },
  };
}

export function calculatePestIndex({
  temp,
  humidity,
  rain = 0,
  rain7d = 0,
  wind = 0,
  clouds = 0,
  areaType = "mixed",
  month = new Date().getMonth() + 1,
}) {
  if (temp === undefined || humidity === undefined) return null;

  // --- 1. Environmental Scoring  ---
  const tempScore =
    temp < 10 ? 10 : temp < 18 ? 40 : temp <= 32 ? 100 : temp <= 38 ? 60 : 20;
  const humidityScore = humidity < 30 ? 10 : humidity < 50 ? 50 : 100;

  const rainScore = (() => {
    const combined = 0.3 * rain + 0.7 * (rain7d / 7);
    if (combined === 0) return 0;
    if (combined < 2) return 40;
    if (combined < 5) return 70;
    return 100;
  })();

  const windScore = wind < 4 ? 100 : wind < 12 ? 60 : 10;

  // based on clouds  (low UV risk)
  const cloudMultiplier = clouds > 70 ? 1.1 : 1.0;

  // --- 2. Season Multiplier ---
  const isMonsoon = month >= 6 && month <= 9;
  const isWinter = month >= 11 || month <= 2;

  // --- 3. Pest Specific Impacts (With Area & Season Boosts) ---

  // Mosquitoes: Monsoon and rural (high)
  let mosquito =
    (0.3 * tempScore +
      0.25 * humidityScore +
      0.35 * rainScore +
      0.1 * windScore) *
    cloudMultiplier;
  if (isMonsoon) mosquito *= 1.3;
  if (areaType === "rural") mosquito *= 1.2;

  // Termites:  Rural & Monsoon (high)
  let termite = 0.4 * tempScore + 0.6 * ((humidityScore + rainScore) / 2);
  if (isMonsoon) termite *= 1.4;
  if (areaType === "rural") termite *= 1.3;

  // Cockroaches: Shehar ke gutter aur pakke makano mein zyada
  let cockroach =
    0.5 * tempScore + 0.3 * humidityScore + 0.2 * (rain > 0 ? 100 : 40);
  if (areaType === "urban") cockroach *= 1.2;

  // Bedbugs: Area type Urban (crowded places)
  let bedbug = 0.8 * 60 + 0.2 * tempScore;
  if (areaType === "urban") bedbug *= 1.2;

  // Rodents: Thand (Winter) mein aur Rural/Kheti wale area mein zyada aate hain
  let rodent = 0.4 * tempScore + 0.6 * (rainScore > 70 ? 100 : 40);
  if (isWinter) rodent *= 1.4;
  if (areaType === "rural") rodent *= 1.2;

  let fly =
    0.45 * tempScore +
    0.3 * humidityScore +
    0.15 * (wind < 8 ? 100 : 30) +
    0.1 * (rain > 0 && rain < 8 ? 80 : 40);

  // Urban boost (restaurants, garbage, drains)
  if (areaType === "urban") fly *= 1.25;

  // Excessive rain suppresses fly movement
  if (rain > 15) fly *= 0.7;

  // --- 4. Normalization & PPI (Tumhara purana logic) ---
  const normalize = (val) => {
    const score = Math.round(Math.max(0, Math.min(100, val))); // Cap at 100
    const level =
      score < 25
        ? "Low"
        : score < 45
          ? "Moderate"
          : score < 75
            ? "High"
            : "Very High";
    return { score, level };
  };

  const pests = {
    mosquito: normalize(mosquito),
    cockroach: normalize(cockroach),
    termite: normalize(termite),
    fly: normalize(
      (0.5 * tempScore + 0.3 * humidityScore + 0.2 * windScore) *
        cloudMultiplier,
    ),
    rodent: normalize(rodent),
    bedbug: normalize(bedbug),
  };

  const pestArray = Object.entries(pests).map(([name, details]) => ({
    name,
    ...details,
    icon: `/pests/${name}.png`,
  }));

  const ppiValue =
    pests.termite.score * 0.3 +
    pests.mosquito.score * 0.3 +
    pests.cockroach.score * 0.2 +
    pests.rodent.score * 0.2;

  return {
    pests: pestArray,
    ppi: normalize(ppiValue),
    environment: {
      tempScore,
      humidityScore,
      rainScore,
      windScore,
      areaType,
      month,
    },
  };
}
