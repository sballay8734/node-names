import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export const POPOVER_OPTIONS: { text: string; icon: React.ReactNode }[] = [
  // selected nodes === 0 *****************************************************
  {
    text: "Create A New Node",
    icon: <MaterialIcons name="person-add-alt-1" size={18} color="#170038" />,
  },
  {
    text: "Create A New Group",
    icon: <MaterialIcons name="group-add" size={18} color="#170038" />,
  },

  // selected nodes === 1 (CONNECT TO CURRENT NODE) ****************************
  {
    text: "Connect A New Node",
    icon: (
      <MaterialCommunityIcons name="connection" size={18} color="#170038" />
    ),
  },
  {
    text: "Connect A New Group",
    icon: (
      <MaterialCommunityIcons name="connection" size={18} color="#170038" />
    ),
  },

  // selected nodes > 1 ********************************************************
  {
    text: "Connect Selected Nodes",
    icon: <MaterialIcons name="link" size={18} color="#170038" />,
  },
  {
    text: "Create Group From Selection",
    icon: <MaterialIcons name="group-work" size={18} color="#170038" />,
  },
];

export function usePopoverOptions() {
  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );

  const getPopoverOptions = () => {
    const selectedCount = selectedNodes.length;

    if (selectedCount === 0) {
      return [POPOVER_OPTIONS[0], POPOVER_OPTIONS[1]];
    } else if (selectedCount === 1) {
      return [POPOVER_OPTIONS[2], POPOVER_OPTIONS[3]];
    } else {
      return [POPOVER_OPTIONS[4], POPOVER_OPTIONS[5]];
    }
  };

  return getPopoverOptions();
}

// !TODO: Change all icons to custom icons

// Create A New Group
// Create A New Node

// Connect A New Node
// Connect A New Group

// Connect Selected Nodes
// Create Group From Selection
