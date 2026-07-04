import React, { useState } from 'react';
import { View, Image, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface ImageCarouselProps {
  images: any[];
  height?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = 240 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / containerWidth);
    setActiveIndex(index);
  };

  const currentImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?w=800'
  ];

  return (
    <View 
      className="relative"
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
    >
      <FlatList
        data={currentImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => {
          const isRemote = typeof item === 'string' && (item.startsWith('http') || item.startsWith('file'));
          return (
            <View style={{ width: containerWidth, height }}>
              <Image
                source={isRemote ? { uri: item } : item}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          );
        }}
      />

      {currentImages.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center space-x-1.5">
          {currentImages.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full ${
                index === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
};
