import { extendTheme } from "native-base";

const meepleyColorTheme = {
  brand: {
    100: "#b1a3e4",
    200: "#a493e0",
    300: "#9784db",
    400: "#8a74d7",
    500: "#7d65d2",
    600: "#715bbd",
    700: "#6451a8",
    800: "#584793",
    900: "#4b3d7e",
  },
  lGreen: {
    100: "#CADF9A",
    200: "#C1D989",
    300: "#B9D479",
    400: "#B0CE68",
    500: "#A7C957",
    600: "#96B54E",
    700: "#86A146",
    800: "#758D3D",
    900: "#647934",
  },
  lYellow: {
    100: "#FEF8CB",
    200: "#FEEF98",
    300: "#FEE365",
    400: "#FDD83F",
    500: "#FDC500",
    600: "#D9A400",
    700: "#B68500",
    800: "#926800",
    900: "#795300",
  },
  lRed: {
    100: "#FEE9DE",
    200: "#FDCEBE",
    300: "#FBAD9D",
    400: "#F88D83",
    500: "#F45B5B",
    600: "#D1424E",
    700: "#AF2D44",
    800: "#8D1D3A",
    900: "#751133",
  },
  grays: {
    500: "#979797",
    light: "#FAFAFA",
    bottomBar: "#F4F4F4",
  },
};

const getTheme = (fontSize: number = 16) => {
  const theme = extendTheme({
    colors: meepleyColorTheme,
    fontConfig: {
      Poppins: {
        300: {
          normal: "Poppins_300Light",
          italic: "Poppins_300Light_Italic",
        },
        400: {
          normal: "Poppins_400Regular",
          italic: "Poppins_400Regular_Italic",
        },
        500: {
          normal: "Poppins_500Medium",
          italic: "Poppins_500Medium_Italic",
        },
        700: {
          normal: "Poppins_700Bold",
          italic: "Poppins_700Bold_Italic",
        },
      },
    },
    fonts: {
      heading: "Poppins",
      body: "Poppins",
      mono: "Poppins",
    },

    fontSizes: {
      sm: 16,
    },
    components: {
      Button: {
        variants: {
          outline({ colorScheme }) {
            return {
              _light: {
                borderColor: "brand.500",
              },
            };
          },
        },
      },

      Text: {
        variants: {
          shadow: () => {
            return {
              textShadowColor: "rgba(0, 0, 0, 0.25)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            };
          },
        },
      },
      Input: {
        baseStyle: {
          _light: {
            fontFamily: "body",

            _focus: {
              borderColor: "lGreen.500",
              backgroundColor: "white",
            },
          },
        },
      },
      Select: {
        baseStyle: {
          _light: {
            _focus: {
              borderColor: "lGreen.500",
            },
          },
        },
      },
      Radio: {
        baseStyle: {
          _light: {
            _checked: {
              borderColor: `gray.300`,
            },
          },
        },
      },
      Toast: {
        defaultProps: {
          placement: "bottom",
        },
      },
    },
  });

  /*   type CustomThemeType = typeof theme;

  declare module "native-base" {
    interface ICustomTheme extends CustomThemeType {}
  } */
  return theme;
};

export default getTheme;
