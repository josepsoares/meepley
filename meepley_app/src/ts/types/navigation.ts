/**
 * https://reactnavigation.org/docs/typescript/
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../../navigation";

export type PlaceProps = NativeStackScreenProps<StackParamList, "Place">;
export type ProfileProps = NativeStackScreenProps<StackParamList, "Profile">;
export type BoardgameProps = NativeStackScreenProps<
  StackParamList,
  "Boardgame"
>;
export type MatchroomProps = NativeStackScreenProps<
  StackParamList,
  "Matchroom"
>;

export type BoardgamesListProps = NativeStackScreenProps<
  StackParamList,
  "BoardgamesList"
>;

export type PlacesListProps = NativeStackScreenProps<
  StackParamList,
  "PlacesList"
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends StackParamList {}
  }
}
