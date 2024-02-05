import React, {
  Fragment,
  memo,
} from "react";
import {
  Text,
  View,
} from "react-native";
// import isEmpty from "lodash/isEmpty";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { DownloadButton } from "../More/DownloadsScreen";
// import LoadingView from "../../components/LoadingView";
import EmptyView from "../../components/EmptyView";

// import * as hFunctions from "../../services/helperFunctions";
import { useCustomer } from "../../context/CustomerContext";
import styles from "./EventDetailsStyle";
// import APIs from "../../services/api";

const EventResources = (props) => {
  const { documents = [], eventId = '', placings = [] } = props;
  console.log({documents:documents.length});

  const firstPlace = placings.length >= 0 ? placings[0] : {};
  const secondPlace = placings.length >= 1 ? placings[1] : {};
  const thirdPlace = placings.length >= 2 ? placings[2] : {};
  const otherPlacings = placings.filter((_p, ind) => ind > 2);

  const { icons = {}, currentCustomer = {} } = useCustomer();

  const { primary2 = "#196391", primary1 = "#20366B" } = currentCustomer;
  // const [downloading, setDownloading] = useState(false);
  // const [dataLoader, setDataLoader] = useState(false);
  // const [eventPlacingData, setEventPlacingData] = useState({});
  // const [eventPlacingkeys, setEventPlacingKeys] = useState([]);
  // const [eventPlacingValues, setEventPlacingValues] = useState([]);
  // const [remaingPlacingValues, setRemainingValues] = useState([]);
  // const [remaingPlacingKeys, setRemainingKeys] = useState([]);

  // useEffect(() => {
  //   if (eventId) {
  //     getEventPlacing();
  //   }
  // }, [eventId])


  // const onDocPress = async (link = "") => {
  //   try {
  //     if (link && hFunctions.hasUrlPDF(link)) {
  //       setDownloading(true);
  //       hFunctions.fileDownload(
  //         link,
  //         null,
  //         async ({ fileContentUrl }) => {
  //           setDownloading(false);
  //           hFunctions.openFile({ fileUrl: fileContentUrl, link });
  //         },
  //         (error) => {
  //           setDownloading(false);
  //           const errorMessage = hFunctions.getErrorMessage(error);
  //           hFunctions.showNotificationMessage("File Download Error", errorMessage.trim(), {
  //             type: "danger",
  //           });
  //         }
  //       );
  //     } else if (link) {
  //       await Linking.openURL(link);
  //     }
  //   } catch (error) { }
  // };

  // const getEventPlacing = async () => {
  //   try {
  //     setDataLoader(true);

  //     const userId = await AsyncStorage.getItem("@userId");
  //     const eventBodyData = {
  //       event_id: eventId
  //     }
  //     const res = await APIs.getEventPlacing(eventBodyData, { user_id: userId, });
  //     const placingData = res?.data || {};
  //     console.log("placingData", placingData);
  //     if (!isEmpty(placingData)) {
  //       setEventPlacingData(placingData)
  //       setEventPlacingKeys(Object.keys(placingData));
  //       setEventPlacingValues(Object.values(placingData));
  //       setRemainingKeys(Object.keys(placingData).splice(3))
  //       setRemainingValues(Object.values(placingData).splice(3))
  //     }

  //   } catch (error) {
  //     const errorMessage = hFunctions.getErrorMessage(error);
  //     hFunctions.showNotificationMessage("Error", errorMessage.trim(), {
  //       type: "danger",
  //     });
  //   } finally {
  //     setDataLoader(false);
  //   }
  // };


  return (
    <View style={styles.infoContainer}>
      <View>
        {/* <Text style={styles.documentTitle(primary2)}>Placings</Text>
        <View style={styles.titleIndicator(primary2)} />

        {dataLoader ?
          <LoadingView style={{
            alignSelf: 'center',
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          }} />
          :
          <View style={styles.placingmainContainerStyle}>
            <View style={styles.placingFirstStyle(primary1)}>
              <View style={styles.placingFirstStyleInner(primary1)}>
                <Text style={styles.placingFirstTextStyle}>
                  {eventPlacingkeys[0]}
                </Text>
              </View>
            </View>
            <Text style={styles.textPlayerName(21, 25)}>{eventPlacingValues[0]}</Text>
            <View style={styles.placingMiddleStyleContainer}>
              <View style={{ alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                <View style={styles.placingMiddleStyle('center')}>
                  <Text style={styles.placingMiddleTextStyle}>{eventPlacingkeys[1]}</Text>
                </View>
                <Text style={styles.textPlayerName(15, 18)}>{eventPlacingValues[1]}</Text>
              </View>
              <View style={{ alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                <View style={styles.placingMiddleStyle('center')}>
                  <Text style={styles.placingMiddleTextStyle}>{eventPlacingkeys[2]}</Text>
                </View>
                <Text style={styles.textPlayerName(15, 18)}>{eventPlacingValues[2]}</Text>
              </View>
            </View>
            <View style={styles.placingEndStyleContainer}>
              <View style={styles.placingTableStyle('#666666')}>
                <View style={styles.placingTableColum1('#666666')}>
                  <Text style={styles.textPlayerName(17, 21)}>{'Place'}</Text>
                </View>
                <View style={styles.placingTableColum2}>
                  <Text style={styles.textPlayerName(17, 21)}>{'Team'}</Text>
                </View>
              </View>
              {
                remaingPlacingKeys.map((data, index) => {
                  return (
                    <View style={styles.placingTableStyle('#666666')}>
                      <View style={styles.placingTableColum1('#666666')}>
                        <Text style={styles.textPlayerName(17, 21)}>{data}</Text>
                      </View>
                      <View style={styles.placingTableColum2}>
                        <Text style={styles.textPlayerName(17, 21)}>{remaingPlacingValues[index]}</Text>
                      </View>
                    </View>
                  )
                })
              }
              <View style={styles.tableSeparator('#666666')} />
            </View>
          </View>
        } */}
        {
          placings.length > 0 ? (
            <Fragment>
              <Text style={styles.documentTitle(primary2)}>Placings</Text>
              <View style={styles.titleIndicator(primary2)} />

              <View style={styles.placingmainContainerStyle}>
                <View style={styles.placingFirstStyle(primary1)}>
                  <View style={styles.placingFirstStyleInner(primary1)}>
                    <Text style={styles.placingFirstTextStyle}>
                      {firstPlace?.title ?? ""}
                    </Text>
                  </View>
                </View>
                <Text style={styles.textPlayerName(21, 25)}>{firstPlace?.value ?? ""}</Text>
                <View style={styles.placingMiddleStyleContainer}>
                  <View style={{ alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                    <View style={styles.placingMiddleStyle('center')}>
                      <Text style={styles.placingMiddleTextStyle}>{secondPlace?.title ?? ""}</Text>
                    </View>
                    <Text style={styles.textPlayerName(15, 18)}>{secondPlace?.value ?? ""}</Text>
                  </View>
                  <View style={{ alignSelf: 'flex-end', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                    <View style={styles.placingMiddleStyle('center')}>
                      <Text style={styles.placingMiddleTextStyle}>{thirdPlace?.title ?? ""}</Text>
                    </View>
                    <Text style={styles.textPlayerName(15, 18)}>{thirdPlace?.value ?? ""}</Text>
                  </View>
                </View>
                <View style={styles.placingEndStyleContainer}>
                  <View style={styles.placingTableStyle('#666666')}>
                    <View style={styles.placingTableColum1('#666666')}>
                      <Text style={styles.textPlayerName(17, 21)}>{'Place'}</Text>
                    </View>
                    <View style={styles.placingTableColum2}>
                      <Text style={styles.textPlayerName(17, 21)}>{'Team'}</Text>
                    </View>
                  </View>
                  {
                    otherPlacings.map(({ id, title = "", value = "" }) => {
                      return (
                        <View
                          key={JSON.stringify(id)}
                          style={styles.placingTableStyle('#666666')}
                        >
                          <View style={styles.placingTableColum1('#666666')}>
                            <Text style={styles.textPlayerName(17, 21)}>{title}</Text>
                          </View>
                          <View style={styles.placingTableColum2}>
                            <Text style={styles.textPlayerName(17, 21)}>{value}</Text>
                          </View>
                        </View>
                      )
                    })
                  }
                  <View style={styles.tableSeparator('#666666')} />
                </View>
              </View>
              
            </Fragment>
          ) : null
        }
        {
          documents.length > 0 ? (
            <View>
              <Text style={styles.documentTitle(primary2)}>Documents</Text>
              <View style={styles.titleIndicator(primary2)} />
              {documents.map((doc, ind) => (
                <DownloadButton
                  key={ind.toString()}
                  item={{ ...doc, ...icons?.download }}
                />
              ))}
            </View>
          ) : null
        }
        {
          documents.length === 0 && placings.length === 0 ? (
            <EmptyView
              message="No resources found"
            />
          ) : null
        }
        {/* {
          downloading ? (
            <LoadingView style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }} />
          ) : null
        } */}
      </View>
    </View>
  )
};

export default memo(EventResources);
