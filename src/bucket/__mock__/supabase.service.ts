export const SupabaseServiceMock = {
    client: {
        storage: {
            from: {
                upload: jest.fn(),
                createSignedUrl: jest.fn(),
            },
        },
        auth: {
            signInWithOtp: jest.fn(),
            verifyOtp: jest.fn(),
        },
    },
};
