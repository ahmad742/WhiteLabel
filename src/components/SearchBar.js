import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import isFunction from "lodash/isFunction";
import AntDesign from "react-native-vector-icons/AntDesign";

import { useCustomer } from "../context/CustomerContext";

const SearchBar = (props) => {
  const { onChangeText, searchProps = {} } = props;
  const searchInput = useRef();
  const [search, setSearch] = useState("");
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  const inputFocus = () => {
    if (searchInput.current) {
      searchInput.current.focus();
    }
  };

  const onSearch = (text) => {
    setSearch(text);
    if (isFunction(onChangeText)) {
      onChangeText(text);
    }
  };

  const clearInupt = () => {
    setSearch("");
    if (isFunction(onChangeText)) {
      onChangeText("");
    }
  };

  return (
    <View style={styles.backgroundStyle}>
      <AntDesign onPress={inputFocus} name="search1" size={10} color={primary2} style={styles.iconStyle} />
      <TextInput
        value={search}
        ref={searchInput}
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={onSearch}
        style={styles.inputStyle(primary1)}
        placeholder="What are you looking for?"
        {...searchProps}
      />
      {search.length > 0 ? (
        <AntDesign
          size={10}
          color={primary2}
          name="closecircleo"
          onPress={clearInupt}
          style={styles.closeIconStyle}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    borderColor: '#D1D1D1',
    backgroundColor: 'white',
  },
  inputStyle: (color) => ({
    color,
    flex: 1,
    fontSize: 16,
    alignSelf: 'center',
  }),
  iconStyle: {
    fontSize: 18,
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  closeIconStyle: {
    fontSize: 18,
    marginLeft: 5,
    marginRight: 15,
    alignSelf: 'center',
  },
});

export default SearchBar;
