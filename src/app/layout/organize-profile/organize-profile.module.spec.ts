import { OrganizeProfileModule } from './organize-profile.module';

describe('OrganizeProfileModule', () => {
    let organizeProfileModule: OrganizeProfileModule;

    beforeEach(() => {
        organizeProfileModule = new OrganizeProfileModule();
    });

    it('should create an instance', () => {
        expect(organizeProfileModule).toBeTruthy();
    });
});
