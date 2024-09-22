import { AntDesign } from "@expo/vector-icons";
import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import {
  Modal,
  Portal,
  Button,
  Switch,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { Text, TextInput } from "react-native-paper";
import isEqual from "lodash/isEqual";

const ModalComponent = ({
  isVisible,
  setIsVisible,
  coordinateData,
  updateCoordinateData,
  isSaving,
}: {
  isVisible: boolean;
  setIsVisible: any;
  coordinateData: any;
  updateCoordinateData: any;
  isSaving: any;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData]: any = useState([]);
  const [currKey, setCurrKey] = useState("");
  const [currValue, setCurrValue] = useState("");
  const blockedKeyWords = ["lat", "lng", "_id"];
  const nonEditableKeyWords = ["isBooked", "plotNumber"];

  const transformIntoJson = () => {
    const returnJson: any = {};
    data.forEach((t) => {
      returnJson[t.key] = t.value;
    });
    return returnJson;
  };

  const isDataChanged = useMemo(() => {
    return !isEqual(transformIntoJson(data), coordinateData);
  }, [data, coordinateData]);

  const keyWordDispalyMap = {
    isBooked: "Booking Status",
    plotNumber: "Plot Number",
  };

  const handleDataChange = (key: any, value: any, index: any) => {
    setData((prevData) => {
      const newData: any = [...prevData];
      newData[index] = {
        key: key,
        value: value,
      };
      return newData;
    });
  };

  const convertCoordinateDataIntoArray = () => {
    const currArr: any = [];
    for (const key in coordinateData) {
      currArr.push({
        key: key,
        value: coordinateData[key],
      });
    }
    setData([...currArr]);
  };

  const resetData = () => {
    setCurrKey("");
    setCurrValue("");
    setData([]);
    setIsEditing(false);
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      setIsEditing(false);
    }
  }, [isVisible]);

  useEffect(() => {
    convertCoordinateDataIntoArray();
  }, [coordinateData, isVisible]);

  const generateComponent = () => {
    return data.map(
      (keyValueData: any, idx) =>
        !blockedKeyWords.includes(keyValueData.key) && (
          <View
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              paddingVertical: 6,
            }}
          >
            {isEditing ? (
              <>
                {nonEditableKeyWords.includes(keyValueData.key) ? (
                  <Text>{keyWordDispalyMap[keyValueData.key]} :</Text>
                ) : (
                  <TextInput
                    value={keyValueData.key}
                    onChangeText={(value) => {
                      handleDataChange(value, keyValueData.value, idx);
                    }}
                  />
                )}
                {keyValueData.key === "isBooked" ? (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Switch
                      value={keyValueData.value}
                      onValueChange={() => {
                        handleDataChange(
                          keyValueData.key,
                          !keyValueData.value,
                          idx
                        );
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: 3,
                      }}
                    >
                      {keyValueData.value ? "Booked" : "Not Booked"}
                    </Text>
                  </View>
                ) : (
                  <TextInput
                    value={`${keyValueData.value}`}
                    mode="outlined"
                    onChangeText={(value) =>
                      handleDataChange(keyValueData.key, value, idx)
                    }
                  />
                )}
              </>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 8,
                }}
              >
                <Text style={{ fontWeight: "bold", flex: 0.8 }}>
                  {nonEditableKeyWords.includes(keyValueData.key)
                    ? keyWordDispalyMap[keyValueData.key]
                    : keyValueData.key}
                </Text>
                <Text>:</Text>
                <Text style={{ flex: 2, paddingLeft: 16 }}>
                  {keyValueData.key === "isBooked"
                    ? keyValueData.value
                      ? "Booked"
                      : "Not Booked"
                    : keyValueData.value}
                </Text>
              </View>
            )}
            <Divider
              style={{
                marginTop: 10,
              }}
              collapsable
            />
          </View>
        )
    );
  };

  return (
    <Portal>
      {isSaving && (
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999999,
            backgroundColor: "rgba(255, 236, 224, 0.9)",
          }}
        >
          <ActivityIndicator animating={true} />
          <Text
            style={{
              marginTop: 5,
            }}
          >
            Saving the data
          </Text>
        </View>
      )}
      <Modal
        visible={isVisible}
        onDismiss={() => {
          resetData();
        }}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          margin: 5,
        }}
      >
        <ScrollView>
          <View>{generateComponent()}</View>
          {isEditing && (
            <View
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TextInput
                mode="flat"
                placeholder="Eg.(Area)"
                value={currKey}
                onChangeText={(value) => setCurrKey(value)}
              />
              <TextInput
                mode="flat"
                placeholder="Eg.(2000sqt)"
                value={currValue}
                onChangeText={(value) => setCurrValue(value)}
                onSubmitEditing={() => {
                  setData((prev) => [
                    ...prev,
                    { key: currKey, value: currValue },
                  ]);
                  setCurrKey("");
                  setCurrValue("");
                }}
                right={
                  <TextInput.Icon
                    disabled={currKey === "" || currValue === ""}
                    icon="plus"
                    onPress={() => {
                      setData((prev) => [
                        ...prev,
                        { key: currKey, value: currValue },
                      ]);
                      setCurrKey("");
                      setCurrValue("");
                    }}
                  />
                }
              />
            </View>
          )}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          {isEditing ? (
            <Button
              mode="contained"
              disabled={!isDataChanged}
              onPress={() => {
                updateCoordinateData(transformIntoJson(data));
                setIsVisible(false);
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              icon={(props) => (
                <AntDesign
                  name="edit"
                  color={props.color}
                  size={props.size}
                  allowFontScaling={props.allowFontScaling}
                />
              )}
              mode="contained"
              onPress={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
          )}
          {isEditing ? (
            <Button
              onPress={() => {
                convertCoordinateDataIntoArray();
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              onPress={() => {
                setIsVisible(false);
              }}
            >
              Close
            </Button>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalComponent;
