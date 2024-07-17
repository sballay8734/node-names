import { View } from "@/components/Themed";
import CPressable from "@/components/CustomNativeComponents/CPressable";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";
import { usePopoverOptions } from "./utils/determineOptions";

export default function Popover(): React.JSX.Element {
  const popoverOptions = usePopoverOptions();

  const isVisible = useAppSelector(
    (state: RootState) => state.selections.popoverIsShown,
  );

  return (
    <View
      style={{
        position: "absolute",
        bottom: 25,
        width: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        height: "auto",
        zIndex: 1000,
        paddingVertical: 10,
        borderRadius: 5,
        gap: 8,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {popoverOptions.map((option) => {
        return (
          <CPressable
            key={option.text}
            icon={option.icon}
            containerStyles={{
              height: 40,
              backgroundColor: "grey",
              display: "flex",
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 6,
              width: "70%",
              borderRadius: 100,
            }}
            textStyles={{ color: "black" }}
            text={option.text}
          />
        );
      })}
    </View>
  );
}

// !TODO: Animate each popover item in like a handheld fan
