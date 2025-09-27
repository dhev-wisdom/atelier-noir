import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const banners = [
        {
            id: 1,
            image: '/src/assets/img/banner/banner-1.jpg',
            title: 'Fall - Winter Collections 2030',
            description: 'A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.',
            link: '/shop/category'
        },
        {
            id: 2,
            image: '/src/assets/img/banner/banner-2.jpg',
            title: 'Spring Collection',
            description: 'A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.',
            link: '/shop/category'
        },
        {
            id: 3,
            image: '/src/assets/img/banner/banner-3.jpg',
            title: 'Summer Specials',
            description: 'A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.',
            link: '/shop/category'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="categories">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 p-0">
                        <div className="categories__slider owl-carousel">
                            {banners.map((banner, index) => (
                                <div 
                                    key={banner.id} 
                                    className={`categories__item categories__large__item set-bg ${index === currentSlide ? 'active' : 'hidden'}`}
                                    style={{
                                        backgroundImage: `url(${banner.image})`,
                                        display: index === currentSlide ? 'block' : 'none'
                                    }}
                                >
                                    <div className="categories__text">
                                        <h1>{banner.title}</h1>
                                        <p>{banner.description}</p>
                                        <Link to={banner.link}>Shop now</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="categories__slider__dots">
                            {banners.map((_, index) => (
                                <span 
                                    key={index} 
                                    className={index === currentSlide ? 'active' : ''}
                                    onClick={() => handleDotClick(index)}
                                ></span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;