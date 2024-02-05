import React, { Fragment } from "react";
import {
  View,
  Text,
} from "react-native";
import isEmpty from "lodash/isEmpty";

import DescriptionComponent from "../../components/DescriptionComponent";
import EmptyView from "../../components/EmptyView";

import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";

export default (props) => {
  const { sponsor = {} } = props;
  const { currentCustomer = {} } = useCustomer();
  const { primary1 = "#1F376A" } = currentCustomer;
  const { name = "", slogan = "", color = "", info = "", links = [] } = sponsor;

  const renderSponsorView = () => {
    if (isEmpty(sponsor)) {
      return (
        <EmptyView
          message="No information found"
        />
      );
    }

    return (
      <View style={styles.sponsorDataContainer}>
        {
          name ? (
            <Fragment>
              <Text style={styles.lblStyl}>Proudly Sponsored By</Text>
              <Text style={styles.sponsorTitle(color || primary1)}>{name}</Text>
              {slogan ? <Text style={styles.sponsorSlogan(color || primary1)}>{slogan}</Text> : null}
            </Fragment>
          ) : null
        }
        <DescriptionComponent
          description={info}
          baseStyle={styles.sponsorDescription}
        />
        {
          links.length > 0 ? (
            <Fragment>
              <Text style={styles.sponsorTitle(color || primary1)}>Contact Us</Text>
              {
                links.map(lnk => (
                  <View key={`${lnk.name}-${lnk.link}`} style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.sponsorLinkLbl}>{lnk.name} : </Text>
                    <Text
                      selectable={true}
                      style={[styles.sponsorLinkLbl, styles.sponsorLink(color || primary1)]}
                    >
                      {lnk.link}
                    </Text>
                  </View>
                ))
              }
            </Fragment>
          ) : null
        }
      </View>
    );
  };
  return (
    <View contentContainerStyle={styles.infoContainer}>
      {renderSponsorView()}
    </View>
  );
};
