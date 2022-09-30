import usersRequests from "./users";
import boardgamesRequests from "./boardgames";
import matchroomsRequests from "./matchrooms";
import placesRequests from "./places";
import cardsRequests from "./cards";
import achievementsRequests from "./achievements";

const MeePleyAPI = {
  users: usersRequests,
  boardgames: boardgamesRequests,
  matchrooms: matchroomsRequests,
  places: placesRequests,
  achievements: achievementsRequests,
  cards: cardsRequests,
};

export default MeePleyAPI;
