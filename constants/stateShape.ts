// NEW STATE SHAPE ************************************************************

interface State {
  user: {};
  graph: {
    vertices: {
      byId: {}; // also contains "isShown", "isActive" field
      allIds: [];
    };
    edges: {
      byId: {};
      allIds: [];
    };
    groups: {
      byId: {};
      allIds: [];
    };
  };

  // THESE ARE JUST EXAMPLES (ONLY USE WHAT YOU'LL NEED)
  ui: {
    activeRoot: number | null; // ID of the active root node
    activePopover: string | null; // ID or name of the currently active popover
    activeDialog: string | null; // ID or name of the currently active dialog
    visibility: {
      popoverVisibility: { [key: string]: boolean }; // Popover visibility states
      dialogVisibility: { [key: string]: boolean }; // Dialog visibility states
      formVisibility: { [key: string]: boolean }; // Form visibility states
    };
    loadingStates: {
      [key: string]: boolean; // Tracks loading states for various UI components
    };
    errorStates: {
      [key: string]: string | null; // Tracks errors for various UI components
    };
  };
}
