import create from 'zustand';

export const useTripStore = create((set) => ({
  trips: [],
  currentTrip: null,

  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
  updateTrip: (updatedTrip) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip._id === updatedTrip._id ? updatedTrip : trip
      ),
      currentTrip:
        state.currentTrip?._id === updatedTrip._id ? updatedTrip : state.currentTrip,
    })),
  deleteTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip._id !== tripId),
      currentTrip:
        state.currentTrip?._id === tripId ? null : state.currentTrip,
    })),
}));
