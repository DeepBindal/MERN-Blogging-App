import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserProfile } from "../api";
import ProfileHeader from "../components/ProfileHeader";
import { Spinner } from "@nextui-org/react";
import { useAuth } from "../main";

function Profile() {
  const params = useParams();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState();
  const {  isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // useEffect(() => {
  // if (!isAuthenticated) {
  //     navigate("/auth/signin");
  //   }
  // }, [isAuthenticated]);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const response = await fetchUserProfile(id);
      const res = response.data
      setProfile(res)
      setLoading(false);
    };
    getData();
  }, []);
  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <section>
          <ProfileHeader
            username={profile?.username}
            name={`${profile?.firstName} ${profile?.lastName}`}
            imgUrl={profile?.image}
            blogs={profile?.blogs}
          />
        </section>
      )}
    </>
    // <h1>profile</h1>
  );
}

export default Profile;
