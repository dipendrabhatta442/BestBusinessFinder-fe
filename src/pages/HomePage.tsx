import React from 'react';
import Layout from '../components/Layouts/Layout';
import useFetch from '../hooks/useFetch';
import BusinessSearchForm from '@/components/Home/BusinessSearchForm';
import PopularCategories from '@/components/Home/PopularCategories';
import FeaturedBusinesses from '@/components/Home/FeaturedBusinesses';
import FeaturedCampaign from '@/components/Home/FeaturedCampaign';

const HomePage: React.FC = () => {
    // const { data: businesses, loading, error, refetch } = useFetch('/business');
    return (
        <Layout>
            <BusinessSearchForm />
            <PopularCategories />
            <FeaturedBusinesses />
            <FeaturedCampaign />
        </Layout>
    );
};

export default HomePage;
