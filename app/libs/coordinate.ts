import opencage from "opencage-api-client";

export const getCoordinates = async (finalAddress: any) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    const response = await opencage.geocode({
      q: finalAddress,
      key: apiKey,
    });
    if (response.results.length > 0) {
      const { lat, lng } = response.results[0].geometry;
      return [lat, lng];
    }
    return [0, 0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};
