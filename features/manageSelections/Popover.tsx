import { View } from "@/components/Themed";
import CPressable from "@/components/CustomNativeComponents/CPressable";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

// REMOVE: just for testing vvvv
const testOptions: { text: string; icon: React.ReactNode }[] = [
  {
    text: "Add New Connection",
    icon: (
      <MaterialCommunityIcons name="connection" size={18} color="#170038" />
    ),
  },
  {
    text: "Create New Group",
    icon: <MaterialIcons name="group-add" size={18} color="#170038" />,
  },
  {
    text: "Group Current Selections",
    icon: <MaterialIcons name="group-work" size={18} color="#170038" />,
  },
  {
    text: "Link Selections",
    icon: <MaterialIcons name="link" size={18} color="#170038" />,
  },
];

export default function Popover(): React.JSX.Element {
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
      {testOptions.map((option) => {
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
