import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
} from "react-native";

import SearchBar from "../../components/SearchBar";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";

const StudentResult = (props) => {
  const { results = [] } = props;
  const [allResults, setAllResults] = useState(results);
  const searchTimeout = useRef(0);
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A", primary2 = "#1183C7" } = currentCustomer;

  useEffect(() => {
    setAllResults(results);
  }, [results]);

  const onSearch = (query) => {
    if (searchTimeout.current) { clearTimeout(searchTimeout.current); }
    searchTimeout.current = setTimeout(() => {
      const searchRes = results.filter(r => r?.name.includes(query));
      setAllResults(searchRes);
    }, 400);
  };

  const renderResult = (result, index) => {
    const {
      name = "",
      Maths = "",
      English = "",
      Science = "",
      Afrikaans = "",
      pass_rate = "",
    } = result;
    return (
      <View
        style={[styles.resultContainer(primary1), index === allResults.length - 1 ? { borderBottomWidth: 0 } : undefined]}
        key={`${index}-${name ?? ""}`}
      >
        <Text style={styles.studentName(primary1)}>
          <Text style={styles.lblStyl}>Name: </Text>
          {name}
        </Text>
        <View style={styles.studentSeprator} />
        <View style={styles.resultDataContainer}>
          <Text style={styles.lblStyl}>Afrikaans </Text>
          <Text style={styles.studentName(primary1)}>{Afrikaans}</Text>
        </View>
        <View style={styles.resultDataContainer}>
          <Text style={styles.lblStyl}>English </Text>
          <Text style={styles.studentName(primary1)}>{English}</Text>
        </View>
        <View style={styles.resultDataContainer}>
          <Text style={styles.lblStyl}>Maths </Text>
          <Text style={styles.studentName(primary1)}>{Maths}</Text>
        </View>
        <View style={styles.resultDataContainer}>
          <Text style={styles.lblStyl}>Science </Text>
          <Text style={styles.studentName(primary1)}>{Science}</Text>
        </View>
        <View style={styles.studentSeprator} />
        <View style={styles.resultDataContainer}>
          <Text style={styles.lblStyl}>Per </Text>
          <Text style={styles.studentName(primary2)}>{pass_rate}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.infoContainer}>
      <View style={[styles.searchContainer, { marginTop: 0 }]}>
        <SearchBar
          onChangeText={onSearch}
          searchProps={{
            placeholder: "Search student name or surname",
          }}
        />
      </View>
      <View style={[styles.seprator, { marginTop: 20 }]} />
      {allResults.map(renderResult)}
    </View>
  );
};

export default StudentResult;
