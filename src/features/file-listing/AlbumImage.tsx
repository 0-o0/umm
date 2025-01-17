import { Box, Image } from '@chakra-ui/react';
import noCoverFallbackImageURL from '~/assets/no-cover.svg';

interface AlbumImageProps {
  url?: string;
  name?: string;
}

export function AlbumImage({ name, url }: AlbumImageProps) {
  const coverAlternativeText = name ? `Album cover of ${name}` : 'Album cover';

  return (
    <Box w="160px" h="160px" m="auto">
      <Image
        border="2px solid"
        borderColor="gray.400"
        borderRadius="50%"
        objectFit="cover"
        src={url || noCoverFallbackImageURL}
        alt={coverAlternativeText}
      />
    </Box>
  );
}
