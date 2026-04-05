'use client'

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

interface CarouselProps {
    elements: any[]
}

export default function Carousel({ elements }: CarouselProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, playOnInit: true, stopOnInteraction: false })])

    return (
        // View Port: Needs overflow-hidden
        <div className="overflow-hidden w-full mx-auto rounded-lg" ref={emblaRef}>
            
            {/* Container: Needs flex */}
            <div className="flex">
                {
                    elements.map((element, index) => (
                        // Slide: Needs flex-[0_0_100%] makes it take full width. 
                        // position: relative and aspect-square (1:1 ratio) gives the Next Image the height it needs!
                        <div 
                            className="relative flex-[0_0_100%] min-w-0 aspect-video" 
                            key={element.id || index} 
                        >
                            <Image 
                                alt={`slide-${index}`}
                                src={element.downloadUrl}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}