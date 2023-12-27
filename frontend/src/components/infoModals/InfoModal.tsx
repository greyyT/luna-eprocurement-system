import Modal from '@/components/ui/Modal';

interface InfoModalProps {
  isOpen: boolean;
  hasTransitionedIn: boolean;
  onClose: () => void;
  isLoading: boolean;
  location: string;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, hasTransitionedIn, onClose, isLoading, location }) => {
  if (!location) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} hasTransitionedIn={hasTransitionedIn} onClose={onClose} isLoading={isLoading}>
      <div
        className="w-[997px] max-h-[80vh] bg-white rounded-lg py-12 pl-[71px] pr-[83px] overflow-y-auto"
        onClick={(ev) => ev.stopPropagation()}
      >
        <SignInInfo location={location} />
        <SignUpInfo location={location} />
        <CreateEntityInfo location={location} />
        <JoinEntityInfo location={location} />
        <HomeInfo location={location} />
        <UserListInfo location={location} />
        <TeamInfo location={location} />
        <RolesConfigInfo location={location} />
        <ProductsInfo location={location} />
        <ProductDetail location={location} />
        <VendorDetail location={location} />
        <VendorsInfo location={location} />
        <ProjectsInfo location={location} />
        <PurchaseRequisitionInfo location={location} />
      </div>
    </Modal>
  );
};

const SignInInfo = ({ location }: { location: string }) => {
  if (location !== '/sign-in') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Sign In Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page you can sign in to your account with email and password. If you don't have an account, you can
        create one by clicking the "Sign Up" link below the sign in form.
      </p>
    </>
  );
};

const SignUpInfo = ({ location }: { location: string }) => {
  if (location !== '/sign-up') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Sign Up Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page you can create an account with the email, username and password. If you already have an account,
        you can sign in by clicking the "Sign In" link below the sign up form.
      </p>
    </>
  );
};

const CreateEntityInfo = ({ location }: { location: string }) => {
  if (location !== '/create-entity') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Create Entity Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page you can create a legal entity with the code and registration number. The legal entity code must be
        unique and has a length of 6 characters. If you are provided with a legal entity code, you can join it by
        clicking the "Join a Legal Entity" link above the create entity form.
      </p>
    </>
  );
};

const JoinEntityInfo = ({ location }: { location: string }) => {
  if (location !== '/join-entity') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Join Entity Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page you can join a legal entity with a provided legal entity code, or you can create one by clicking
        the "Create a Legal Entity" link above the join entity form.
      </p>
    </>
  );
};

const HomeInfo = ({ location }: { location: string }) => {
  if (location !== '/') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Home Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        Explore this app by clicking on the links in the navigation bar.
      </p>
    </>
  );
};

const UserListInfo = ({ location }: { location: string }) => {
  if (location !== '/settings/user-list') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">User List Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see all the users in your legal entity if your role is "Manager". If you're a Manager, you
        can edit user's role, department and team and you can also delete users from your legal entity.
      </p>
    </>
  );
};

const TeamInfo = ({ location }: { location: string }) => {
  if (location !== '/settings/teams') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Team Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see all the departments and teams in your legal entity if your role is "Manager". Teams
        are part of departments. If you're a Manager, you can create and delete departments and teams.
      </p>
    </>
  );
};

const RolesConfigInfo = ({ location }: { location: string }) => {
  if (location !== '/settings/roles-config') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Roles Config Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see all the roles in your legal entity if your role is "Manager". If you're a Manager, you
        can edit roles' permissions (reject and approve). You can see how this permission works in Purchase Requisition
        Page.
      </p>
    </>
  );
};

const ProductsInfo = ({ location }: { location: string }) => {
  if (location !== '/products') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Products Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see all the products in your entity. You can search for a product by vendor, SKU, code and
        name, create a new product and delete a product.
      </p>
    </>
  );
};

const ProductDetail = ({ location }: { location: string }) => {
  if (!location.includes('/products/')) return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Product Detail Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see the details of a product, assign a product to vendors with their prices and edit the
        prices. You can also delete the vendor from the product.
      </p>
    </>
  );
};

const VendorsInfo = ({ location }: { location: string }) => {
  if (location !== '/vendors') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Vendors Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see all the vendors in your entity. You can search for a vendor by code, name or business
        number, create a new vendor and delete a vendor.
      </p>
    </>
  );
};

const VendorDetail = ({ location }: { location: string }) => {
  if (!location.includes('/vendors/')) return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Vendor Detail Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see the details of a vendor, create a new contact for the vendor and delete the contact.
      </p>
    </>
  );
};

const ProjectsInfo = ({ location }: { location: string }) => {
  if (location !== '/projects') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Projects Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can see all the projects in your entity. You can search for a project by name, label and code,
        create a new project, mark a project as default, edit and delete a project.
      </p>
    </>
  );
};

const PurchaseRequisitionInfo = ({ location }: { location: string }) => {
  if (location !== '/purchase-requisition') return null;

  return (
    <>
      <h1 className="text-4xl text-primary font-inter font-semibold">Purchase Requisition Page</h1>
      <div className="line my-4"></div>
      <p className="pt-4 font-inter text-base leading-6">
        On this page, you can create a purchase requisition. Purchase Requisition is a request to purchase a product
        from a vendor and it is associated with a project. You can add multiple products to a purchase requisition.
        Purchase Requisitions are displayed as Kanban's item in the Kanban Board. You can edit and delete a purchase
        requisition.
      </p>
    </>
  );
};

export default InfoModal;
