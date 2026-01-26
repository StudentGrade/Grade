import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      strict: false
    }),
    paths: {
      base: '/Grades'
    },
    prerender: {
      handleHttpError: 'warn'
    }
  }
};

export default config;
