import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/store/store";

export const POPOVER_OPTIONS: {
  text: string;
  icon: React.ReactNode;
}[] = [
  // selected nodes === 0 *****************************************************
  {
    text: "Create a new node",
    icon: <MaterialIcons name="person-add-alt-1" size={18} color="#170038" />,
  },
  {
    text: "Create a new group",
    icon: <MaterialIcons name="group-add" size={18} color="#170038" />,
  },

  // selected nodes === 1 (CONNECT TO CURRENT NODE) ****************************
  {
    text: "Connect to a new node",
    icon: (
      <MaterialCommunityIcons name="connection" size={18} color="#170038" />
    ),
  },
  {
    text: "Connect to a new group",
    icon: (
      <MaterialCommunityIcons name="connection" size={18} color="#170038" />
    ),
  },

  // selected nodes > 1 ********************************************************
  {
    text: "Connect selected nodes",
    icon: <MaterialIcons name="link" size={18} color="#170038" />,
  },
  {
    text: "Create group from selection",
    icon: <MaterialIcons name="group-work" size={18} color="#170038" />,
  },

  // REMOVE: Just temporary to demonstrate need
  {
    text: "ERROR: Can only connect root to a NEW node/group",
    icon: <MaterialIcons name="group-work" size={18} color="red" />,
  },
];

// !TODO: THIS SHOULD NOT BE CUSTOM HOOK
export function usePopoverOptions() {
  const selectedNodes = useAppSelector(
    (state: RootState) => state.selections.selectedNodes,
  );
  const activeRootNode = useAppSelector(
    (state: RootState) => state.manageGraph.activeRootNode,
  );
  const isRootSelected = useAppSelector(
    (state: RootState) =>
      activeRootNode &&
      state.selections.selectedNodes.includes(activeRootNode.id),
  );

  const getPopoverOptions = () => {
    const selectedCount = selectedNodes.length;

    if (selectedCount === 0) {
      return [POPOVER_OPTIONS[0], POPOVER_OPTIONS[1]];
    } else if (selectedCount === 1) {
      return [POPOVER_OPTIONS[2], POPOVER_OPTIONS[3]];
    } else if (selectedCount === 2 && !isRootSelected) {
      return [POPOVER_OPTIONS[4], POPOVER_OPTIONS[5]];
    } else if (selectedCount > 2 && !isRootSelected) {
      return [POPOVER_OPTIONS[5]];
    } else {
      return [POPOVER_OPTIONS[6]];
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
