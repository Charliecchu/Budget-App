
import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import PieChart from 'react-native-pie-chart'
import Colors from '../utilities/Colors'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function CircularChart({ categoryList }) {
  const widthAndHeight = 150
  const [values, setValues] = useState([])
  const [sliceColor, setSliceColor] = useState([])
  const [totalEstimate, setTotalEstimate] = useState(0)

  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      console.log('CategoryList in CircularChart:', categoryList)  // Log categoryList
      updateCircularChart()
    } else {
      console.log('CategoryList is empty or undefined')  // Log when empty
    }
  }, [categoryList])

  const updateCircularChart = () => {
    const newSliceColor = []
    const newValues = []
    let total = 0
    let otherCategoryTotal = 0

    // Process the first 4 categories or less
    const initialCategories = categoryList.slice(0, 4)

    initialCategories.forEach((item, index) => {
      let itemTotalCost = 0
      if (item.CategoryItems && item.CategoryItems.length > 0) {
        item.CategoryItems.forEach((item_) => {
          itemTotalCost += item_.cost
        })
        console.log(`Total cost for item ${index}: ${itemTotalCost}`)  // Log item total cost
      }

      if (itemTotalCost > 0) {
        newSliceColor.push(Colors.COLOR_LIST[index % Colors.COLOR_LIST.length]) // Ensure it stays within bounds
        newValues.push(itemTotalCost)
        total += itemTotalCost
      }
    })

    // Process remaining categories into 'Other'
    if (categoryList.length > 4) {
      const remainingCategories = categoryList.slice(4)
      remainingCategories.forEach((item) => {
        if (item.CategoryItems && item.CategoryItems.length > 0) {
          item.CategoryItems.forEach((item_) => {
            otherCategoryTotal += item_.cost
          })
        }
      })

      if (otherCategoryTotal > 0) {
        newSliceColor.push(Colors.COLOR_LIST[4 % Colors.COLOR_LIST.length]) // Use a fixed color or extend colors
        newValues.push(otherCategoryTotal)
        total += otherCategoryTotal
      }
    }

    console.log('newSliceColor:', newSliceColor)  // Log new slice colors
    console.log('newValues:', newValues)          // Log new values

    setSliceColor(newSliceColor)
    setValues(newValues)
    setTotalEstimate(total)
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontFamily: 'outfit' }}>
        Total Estimate: <Text style={{ fontFamily: 'outfit-bold' }}>${totalEstimate}</Text>
      </Text>
      <View style={styles.subContainer}>
        {values.length > 0 ? (
          <PieChart
            widthAndHeight={widthAndHeight}
            series={values}
            sliceColor={sliceColor}
            coverRadius={0.65}
            coverFill={'#FFF'}
          />
        ) : (
          <View style={styles.chartNameContainer}>
            <MaterialCommunityIcons name="checkbox-blank-circle" size={24} color={Colors.GRAY} />
            <Text>NA</Text>
          </View>
        )}
        {categoryList && categoryList.length > 0 && (
          <View>
            {categoryList.slice(0, 4).map((category, index) => (
              <View key={category.id} style={styles.chartNameContainer}>
                <MaterialCommunityIcons name="checkbox-blank-circle" size={24} color={Colors.COLOR_LIST[index % Colors.COLOR_LIST.length]} />
                <Text>{category.name}</Text>
              </View>
            ))}
            {categoryList.length > 4 && (
              <View key="other" style={styles.chartNameContainer}>
                <MaterialCommunityIcons name="checkbox-blank-circle" size={24} color={Colors.COLOR_LIST[4 % Colors.COLOR_LIST.length]} />
                <Text>Other</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 15,
    elevation: 1,
  },
  subContainer: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    gap: 40,
  },
  chartNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
})