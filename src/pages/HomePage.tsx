import React from 'react';
import Layout from '../components/Layouts/Layout';
import useFetch from '../hooks/useFetch';
import BusinessSearchForm from '@/components/Home/BusinessSearchForm';
import PopularCategories from '@/components/Home/PopularCategories';
import FeaturedBusinesses from '@/components/Home/FeaturedBusinesses';

const HomePage: React.FC = () => {
    const { data: businesses, loading, error, refetch } = useFetch('/business');
    console.log({ businesses })
    return (
        <Layout>
            <BusinessSearchForm />
            <PopularCategories />
            <FeaturedBusinesses businesses={businesses} />
        </Layout>
    );
};

export default HomePage;
