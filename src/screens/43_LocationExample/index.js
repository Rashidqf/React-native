import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const LocationExample = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyCv_laQg1thSz-TocYa_o3YbbtN989eBEI',
        language: 'en',
      }}
    />
  );
};

export default LocationExample;
