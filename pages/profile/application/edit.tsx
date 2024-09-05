import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import Link from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GetServerSideProps } from 'next';
import { generateInitialValues, hackPortalConfig } from '@/hackportal.config';
import { useAuthContext } from '@/lib/user/AuthContext';
import { RequestHelper } from '@/lib/request-helper';
import LoadIcon from '@/components/LoadIcon';
import DisplayQuestion from '@/components/registerComponents/DisplayQuestion';
import schoolsList from 'public/schools.json';
import majorsList from 'public/majors.json';
import { Snackbar } from '@mui/material';
/**
 * The edit application page.
 *
 */

interface EditApplicationPageProps {
  allowedRegistrations: boolean;
}

export default function EditApplication({ allowedRegistrations }: EditApplicationPageProps) {
  const router = useRouter();

  const {
    registrationFields: {
      generalQuestions,
      schoolQuestions,
      hackathonExperienceQuestions,
      shortAnswerQuestions,
      eventInfoQuestions,
      sponsorInfoQuestions,
      teammateQuestions,
    },
  } = hackPortalConfig;

  const { user, updatePartialProfile, updateProfile, profile, partialProfile } = useAuthContext();
  // update this to false for testing
  const [loading, setLoading] = useState(false);
  const [registrationSection, setRegistrationSection] = useState(0);
  const [allowManualSave, setAllowManualSave] = useState(true);
  const [displayProfileSavedToaster, setDisplayProfileSavedToaster] = useState(false);

  // TODO: do some auth check

  const handleSaveProfile = (
    registrationData: PartialRegistration,
    nextPage: number,
    resetForm: (param: { values: any }) => void,
  ) => {
    return RequestHelper.put<any, { msg: string; registrationData: PartialRegistration }>(
      '/api/applications/save',
      {},
      {
        ...registrationData,
        id: registrationData.id || user.id,
        currentRegistrationPage: nextPage,
      },
    )
      .then(() => {
        setDisplayProfileSavedToaster(true);
        resetForm({ values: registrationData });
        updatePartialProfile(registrationData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSubmit = async (registrationData, enableRedirect = true) => {
    let finalValues: any = { ...registrationData };
    //add user object
    const userValues: any = {
      id: finalValues.id,
      firstName: finalValues.firstName,
      lastName: finalValues.lastName,
      preferredEmail: finalValues.preferredEmail,
      permissions: finalValues.permissions,
    };
    finalValues['user'] = userValues;
    //delete unnecessary values
    delete finalValues.firstName;
    delete finalValues.lastName;
    delete finalValues.permissions;
    delete finalValues.preferredEmail;

    if (finalValues['university'] === 'Other') {
      finalValues['university'] = finalValues['universityManual'];
    }

    if (finalValues['major'] === 'Other') {
      finalValues['major'] = finalValues['majorManual'];
    }

    if (finalValues['heardFrom'] === 'Other') {
      finalValues['heardFrom'] = finalValues['heardFromManual'];
    }

    delete finalValues.universityManual;
    delete finalValues.majorManual;
    delete finalValues.heardFromManual;
    try {
      const { data } = await RequestHelper.put<
        Registration,
        { msg: string; registrationData: Registration }
      >(
        '/api/applications',
        {},
        {
          ...finalValues,
          id: finalValues.id || user.id,
          user: {
            ...finalValues.user,
            id: finalValues.user.id || user.id,
          },
        },
      );
      alert('Application Updated Successfully');
      updateProfile(data.registrationData);
      if (enableRedirect) router.push('/profile');
    } catch (error) {
      console.error(error);
      console.log('Request creation error');
    }
  };

  const isValidUSPhoneNumber = (phoneNumber: string) => {
    return /^(1[ -]?)?\d{3}[ -]?\d{3}[ -]?\d{4}$/.test(phoneNumber);
  };

  const isValidInternationalPhoneNumber = (phoneNumber: string) => {
    return /(\+|00)(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,20}$/.test(
      phoneNumber.replaceAll(' ', ''),
    );
  };

  if (!allowedRegistrations) {
    return (
      <h1 className="mx-auto text-2xl mt-4 font-bold">
        Registrations is closed and no longer allowed
      </h1>
    );
  }

  if (!user) {
    // If user haven't signed in, redirect them to login page
    router.push('/auth');
  }

  if (loading) {
    return <LoadIcon width={200} height={200} />;
  }

  //disables submitting form on enter key press
  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  const setErrors = (obj, values, errors) => {
    if (obj.textInputQuestions)
      for (let inputObj of obj.textInputQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }
    if (obj.numberInputQuestions)
      for (let inputObj of obj.numberInputQuestions) {
        if (inputObj.required) {
          if (isNaN(parseInt(values[inputObj.name]))) {
            errors[inputObj.name] = 'Invalid number';
          } else if (!values[inputObj.name] && values[inputObj.name] !== 0)
            errors[inputObj.name] = 'Required';
        }
      }
    if (obj.dropdownQuestions)
      for (let inputObj of obj.dropdownQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }
    if (obj.checkboxQuestions)
      for (let inputObj of obj.checkboxQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name] || values[inputObj.name].length === 0)
            errors[inputObj.name] = 'Required';
        }
      }
    if (obj.datalistQuestions)
      for (let inputObj of obj.datalistQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }
    if (obj.textAreaQuestions)
      for (let inputObj of obj.textAreaQuestions) {
        if (inputObj.required) {
          if (!values[inputObj.name]) errors[inputObj.name] = 'Required';
        }
      }

    return errors;
  };

  return (
    <div className="flex flex-col flex-grow mb-10">
      <Head>
        <title>Hacker Application</title>
        <meta name="description" content="Register for HackUTD 2024" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="pl-4 relative mb-4 z-[9999]">
        <Link href="/profile">
          <div className="mt-9 md:mt-0 items-center inline-flex text-white font-bold bg-[#40B7BA] rounded-[30px] pr-4 pl-1 py-2 border-2 border-white">
            <ChevronLeftIcon className="text-white" fontSize={'large'} />
            Back to profile
          </div>
        </Link>
      </section>

      <section className="relative">
        <Formik
          initialValues={{
            ...generateInitialValues(profile),
            majorManual: partialProfile?.major || profile?.major || '',
            heardFromManual: partialProfile?.heardFrom || profile?.heardFrom || '',
            // have no idea why this works, but need to hard code it for the form values to overwrite the default
            preferredEmail: partialProfile?.preferredEmail || profile?.user?.preferredEmail || '',
            // have no idea why we need formInitialValues but we need to add it for it to works
            firstName: partialProfile?.firstName || profile?.user?.firstName || '',
            lastName: partialProfile?.lastName || profile?.user?.lastName || '',
            phoneNumber: partialProfile?.phoneNumber || profile?.phoneNumber || '',
            age: partialProfile?.age || profile?.age || '',
            country: partialProfile?.country || profile?.country || '',
            hackathonExperience:
              partialProfile?.hackathonExperience || profile?.hackathonExperience || 0,
            studyLevel: partialProfile?.studyLevel || profile?.studyLevel || '',
            major:
              (partialProfile?.major &&
                majorsList.filter((major) => major.major == partialProfile.major).length > 0 &&
                partialProfile?.major) ||
              (profile?.major &&
                majorsList.filter((major) => major.major == profile.major).length > 0 &&
                profile?.major) ||
              'Other',
            // check if university is in our university list if not set to other
            university:
              (partialProfile?.university &&
                schoolsList.filter((school) => school.university == partialProfile.university)
                  .length > 0 &&
                partialProfile?.university) ||
              (profile?.university &&
                schoolsList.filter((school) => school.university == profile.university).length >
                  0 &&
                profile?.university) ||
              'Other',
            universityManual: partialProfile?.university || profile?.university || '',
            heardFrom:
              (partialProfile?.heardFrom &&
                ['Instagram', 'Twitter', 'Event Site', 'Friend', 'TikTok'].includes(
                  partialProfile.heardFrom,
                ) &&
                partialProfile.heardFrom) ||
              (profile?.heardFrom &&
                ['Instagram', 'Twitter', 'Event Site', 'Friend', 'TikTok'].includes(
                  profile.heardFrom,
                ) &&
                profile.heardFrom) ||
              'Other',
            gender: partialProfile?.gender || profile?.gender || '',
            race: partialProfile?.race || profile?.race || '',
            ethnicity: partialProfile?.ethnicity || profile?.ethnicity || '',
            softwareExperience:
              partialProfile?.softwareExperience || profile?.softwareExperience || '',
            whyAttend: partialProfile?.whyAttend || profile?.whyAttend || '',
            hackathonNumber: partialProfile?.hackathonNumber || profile?.hackathonNumber || '',
            hackathonFirstTimer:
              partialProfile?.hackathonFirstTimer || profile?.hackathonFirstTimer || '',
            lookingForward: partialProfile?.lookingForward || profile?.lookingForward || '',
            size: partialProfile?.size || profile?.size || '',
            dietary: partialProfile?.dietary || profile?.dietary || [],
            accomodations: partialProfile?.accomodations || profile?.accomodations || '',
            github: partialProfile?.github || profile?.github || '',
            linkedin: partialProfile?.linkedin || profile?.linkedin || '',
            website: partialProfile?.website || profile?.website || '',
            teammate1: partialProfile?.teammate1 || profile?.teammate1 || '',
            teammate2: partialProfile?.teammate2 || profile?.teammate2 || '',
            teammate3: partialProfile?.teammate3 || profile?.teammate3 || '',
            codeOfConduct: partialProfile?.codeOfConduct || profile?.codeOfConduct || ['Yes'],
            disclaimer: partialProfile?.disclaimer || profile?.disclaimer || ['Yes'],
            resume: partialProfile?.resume || profile?.resume || '',
          }}
          validateOnBlur={false}
          validateOnChange={false}
          //validation
          //Get condition in which values.[value] is invalid and set error message in errors.[value]. Value is a value from the form(look at initialValues)
          validate={(values) => {
            var errors: any = {};
            for (let obj of generalQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of schoolQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of hackathonExperienceQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of shortAnswerQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of eventInfoQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of sponsorInfoQuestions) {
              errors = setErrors(obj, values, errors);
            }
            for (let obj of teammateQuestions) {
              errors = setErrors(obj, values, errors);
            }

            if (
              !isValidUSPhoneNumber(values['phoneNumber']) &&
              !isValidInternationalPhoneNumber(values['phoneNumber'])
            ) {
              errors.phoneNumber = 'Invalid phone number';
            }

            //additional custom error validation
            if (
              values.preferredEmail &&
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.preferredEmail)
            ) {
              //regex matches characters before @, characters after @, and 2 or more characters after . (domain)
              errors.preferredEmail = 'Invalid email address';
            }
            if ((values.age && values.age < 1) || values.age > 100) {
              errors.age = 'Not a valid age';
            }
            if (
              (values.hackathonExperience && values.hackathonExperience < 0) ||
              values.hackathonExperience > 100
            ) {
              errors.hackathonExperience = 'Not a valid number';
            }

            if (values['major'] === 'Other' && values['majorManual'] === '') {
              errors['majorManual'] = 'Required';
            }

            if (values['university'] === 'Other' && values['universityManual'] === '') {
              errors['universityManual'] = 'Required';
            }

            if (values['heardFrom'] === 'Other' && values['heardFromManual'] === '') {
              errors['heardFromManual'] = 'Required';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            //submitting
            await handleSubmit(values);
            setSubmitting(false);
            // alert(JSON.stringify(values, null, 2)); //Displays form results on submit for testing purposes
          }}
        >
          {({ values, isValid, isSubmitting, resetForm, dirty }) => (
            // Field component automatically hooks input to form values. Use name attribute to match corresponding value
            // ErrorMessage component automatically displays error based on validation above. Use name attribute to match corresponding value
            <>
              <Form
                onKeyDown={onKeyDown}
                className="registrationForm px-4 md:px-24 w-full sm:text-base text-sm"
              >
                {/* General Questions */}
                {registrationSection == 0 && (
                  <section className="mt-12 md:mt-0 bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-4 py-10 px-8 mb-8 text-[#4C4950]">
                    <header>
                      <h1 className="text-[#40B7BA] lg:text-4xl sm:text-3xl text-2xl font-bold text-center mt-2 md:mt-8 mb-4 poppins-bold">
                        Edit Hacker Appplication
                      </h1>
                    </header>
                    <div className="md:px-10">
                      <div className="flex flex-col">
                        {generalQuestions.map((obj, idx) => (
                          <DisplayQuestion key={idx} obj={obj} />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        disabled={!dirty || !allowManualSave}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            setAllowManualSave(false);
                            await handleSaveProfile(values, registrationSection, resetForm);
                          } catch (err) {
                            alert('Error saving form. Please try again later...');
                            console.error(err);
                          } finally {
                            setAllowManualSave(true);
                          }
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Application
                      </button>
                    </div>
                  </section>
                )}

                {/* School Questions */}
                {registrationSection == 1 && (
                  <section className="mt-12 md:mt-0 bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl sm:mb-3 mb-1 poppins-bold mt-2">
                      School Info
                    </h2>
                    <div className="flex flex-col md:px-4 poppins-regular ">
                      {schoolQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                      {values['major'] === 'Other' && (
                        <DisplayQuestion
                          key={1000}
                          obj={{
                            textInputQuestions: [
                              {
                                id: 'majorManual',
                                name: 'majorManual',
                                question: 'What is your major?',
                                required: values['major'] === 'Other',
                                initialValue: '',
                              },
                            ],
                          }}
                        />
                      )}
                      {values['university'] === 'Other' && (
                        <DisplayQuestion
                          key={1000}
                          obj={{
                            textInputQuestions: [
                              {
                                id: 'universityManual',
                                name: 'universityManual',
                                question: 'What is your university?',
                                required: values['university'] === 'Other',
                                initialValue: '',
                              },
                            ],
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        disabled={!dirty || !allowManualSave}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            setAllowManualSave(false);
                            await handleSaveProfile(values, registrationSection, resetForm);
                          } catch (err) {
                            alert('Error saving form. Please try again later...');
                            console.error(err);
                          } finally {
                            setAllowManualSave(true);
                          }
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Application
                      </button>
                    </div>
                  </section>
                )}

                {/* Hackathon Questions */}
                {registrationSection == 2 && (
                  <section className="mt-12 md:mt-0 bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Hackathon Experience
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {hackathonExperienceQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                      {values['heardFrom'] === 'Other' && (
                        <DisplayQuestion
                          key={1000}
                          obj={{
                            textInputQuestions: [
                              {
                                id: 'heardFromManual',
                                name: 'heardFromManual',
                                question: 'Where did you hear about HackUTD Ripple Effect?',
                                required: values['heardFrom'] === 'Other',
                                initialValue: '',
                              },
                            ],
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        disabled={!dirty || !allowManualSave}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            setAllowManualSave(false);
                            await handleSaveProfile(values, registrationSection, resetForm);
                          } catch (err) {
                            alert('Error saving form. Please try again later...');
                            console.error(err);
                          } finally {
                            setAllowManualSave(true);
                          }
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Application
                      </button>
                    </div>
                  </section>
                )}

                {/* Short Answer Questions */}
                {registrationSection == 3 && (
                  <section className="mt-12 md:mt-0 bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Short Answer Questions
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {shortAnswerQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        disabled={!dirty || !allowManualSave}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            setAllowManualSave(false);
                            await handleSaveProfile(values, registrationSection, resetForm);
                          } catch (err) {
                            alert('Error saving form. Please try again later...');
                            console.error(err);
                          } finally {
                            setAllowManualSave(true);
                          }
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Application
                      </button>
                    </div>
                  </section>
                )}

                {/* Event Questions */}
                {registrationSection == 4 && (
                  <section className="mt-12 md:mt-0 bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Event Info
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {/* apply styling issue fix, it's an ugly fix but this solve the styling issue */}
                      {eventInfoQuestions.map((obj, idx) => {
                        // if (idx !== 0) return <DisplayQuestion key={idx} obj={obj} />;

                        return <DisplayQuestion key={idx} obj={obj} />;
                      })}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        disabled={!dirty || !allowManualSave}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            setAllowManualSave(false);
                            await handleSaveProfile(values, registrationSection, resetForm);
                          } catch (err) {
                            alert('Error saving form. Please try again later...');
                            console.error(err);
                          } finally {
                            setAllowManualSave(true);
                          }
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Application
                      </button>
                    </div>
                  </section>
                )}

                {/* Sponsor Questions */}
                {registrationSection == 5 && (
                  <section className="mt-12 md:mt-0 bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950] relative">
                    <h2 className="sm:text-2xl text-xl poppins-bold sm:mb-3 mb-1 mt-2">
                      Sponsor Info
                    </h2>
                    <div className="flex flex-col poppins-regular md:px-4">
                      {sponsorInfoQuestions.map((obj, idx) => (
                        <DisplayQuestion key={idx} obj={obj} />
                      ))}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        disabled={!dirty || !allowManualSave}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            setAllowManualSave(false);
                            await handleSaveProfile(values, registrationSection, resetForm);
                          } catch (err) {
                            alert('Error saving form. Please try again later...');
                            console.error(err);
                          } finally {
                            setAllowManualSave(true);
                          }
                        }}
                        className="bg-[#40B7BA] rounded-lg p-3 text-white font-bold"
                      >
                        Save Application
                      </button>
                    </div>
                  </section>
                )}
                {/* Teammate Questions */}
                {registrationSection == 6 && (
                  <section className="mt-12 md:mt-0 bg-white lg:w-3/5 md:w-3/4 w-full min-h-[35rem] mx-auto rounded-2xl md:py-10 py-6 px-8 mb-8 text-[#4C4950]">
                    <h2 className="sm:text-2xl text-xl font-semibold sm:mb-3 mb-1">
                      Current Teammate
                    </h2>
                    {profile && !profile.teammate1 && !profile.teammate2 && !profile.teammate3 && (
                      <div className="flex flex-col poppins-regular">
                        You currently have no teammates.
                      </div>
                    )}
                    {/* show teammate 1 if exists */}
                    {profile?.teammate1 && (
                      <div className="flex flex-col poppins-regular md:px-4">
                        <div className="flex items-center">
                          <label className="font-semibold">Teammate 1:</label>
                          <span className="ml-2">{profile.teammate1}</span>
                        </div>
                      </div>
                    )}
                    {/* show teammate 2 if exists */}
                    {profile?.teammate2 && (
                      <div className="flex flex-col poppins-regular md:px-4">
                        <div className="flex items-center">
                          <label className="font-semibold">Teammate 2:</label>
                          <span className="ml-2">{profile.teammate2}</span>
                        </div>
                      </div>
                    )}
                    {/* show teammate 3 if exists */}
                    {profile?.teammate3 && (
                      <div className="flex flex-col poppins-regular md:px-4">
                        <div className="flex items-center">
                          <label className="font-semibold">Teammate 3:</label>
                          <span className="ml-2">{profile.teammate3}</span>
                        </div>
                      </div>
                    )}
                    <p className="text-md my-6 font-bold">
                      Want to request a teammate change? Email us at{' '}
                      <Link className="underline" href="mailto:hello@hackutd.co" target="__blank__">
                        hello@hackutd.co
                      </Link>
                    </p>
                    {
                      <div className="flex flex-col poppins-regular md:px-4">
                        {teammateQuestions.map(
                          (obj, idx) =>
                            obj.checkboxQuestions && <DisplayQuestion key={idx} obj={obj} />,
                        )}
                      </div>
                    }
                    {/* Submit */}
                    <div className="mt-8 text-white">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="mr-auto cursor-pointer px-4 py-2 rounded-lg bg-[#40B7BA] hover:brightness-90"
                      >
                        Update Application
                      </button>
                      {!isValid && (
                        <div className="text-red-600 poppins-regular">
                          Error: The form has invalid fields. Please go through the form again to
                          make sure that every required fields are filled out.
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </Form>

              {/* Pagniation buttons */}
              <section
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                }}
                className={`lg:block ${
                  registrationSection == 0
                    ? 'justify-end'
                    : registrationSection >= 6
                    ? 'justify-start'
                    : 'justify-between'
                } lg:pb-4 pb-8 lg:px-4 sm:px-8 px-6 text-primaryDark font-semibold text-primaryDark font-semibold text-md`}
              >
                {registrationSection > 0 && (
                  <div
                    style={{ gridArea: '1 / 1 / 2 / 2' }}
                    // className="lg:fixed 2xl:bottom-8 2xl:left-8 bottom-6 left-6 inline cursor-pointer select-none"
                    onClick={() => {
                      setRegistrationSection(registrationSection - 1);
                    }}
                  >
                    <div
                      style={{ width: 'fit-content' }}
                      className="hidden md:inline-flex cursor-pointer select-none bg-white text-[#40B7BA] rounded-[30px] py-3 pl-2 pr-4 text-xs md:text-lg border-2 border-[#40B7BA]"
                    >
                      <ChevronLeftIcon className="text-[#40B7BA]" />
                      prev page
                    </div>
                    <div
                      style={{ width: 'fit-content' }}
                      className="md:hidden cursor-pointer select-none bg-white text-[#40B7BA] rounded-[30px] py-3 pl-2 pr-4 text-xs md:text-lg border-2 border-[#40B7BA]"
                    >
                      <ChevronLeftIcon className="text-[#40B7BA]" />
                      prev
                    </div>
                  </div>
                )}

                <div
                  className="flex justify-center items-center"
                  style={{ gridArea: '1 / 2 / 2 / 3' }}
                >
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      onClick={async () => {
                        if (dirty) await handleSaveProfile(values, registrationSection, resetForm);
                        setRegistrationSection(i);
                      }}
                      style={{ backgroundColor: registrationSection == i ? '#4C4950' : '#9F9EA7' }}
                      className="rounded-full w-3 h-3 mr-2"
                    />
                  ))}
                </div>

                {registrationSection < 6 && (
                  <div
                    className="flex justify-end "
                    style={{ gridArea: '1 / 3 / 2 / 4' }}
                    onClick={async () => {
                      if (dirty) await handleSaveProfile(values, registrationSection, resetForm);
                      setRegistrationSection(registrationSection + 1);
                    }}
                  >
                    <div
                      style={{ width: 'fit-content' }}
                      className="hidden md:inline-flex cursor-pointer select-none bg-white text-[#40B7BA] text-xs md:text-lg rounded-[30px] py-3 pr-2 pl-4 border-2 border-[#40B7BA]"
                    >
                      next page
                      <ChevronRightIcon />
                    </div>
                    <div
                      style={{ width: 'fit-content' }}
                      className="md:hidden cursor-pointer select-none bg-white text-[#40B7BA] text-xs md:text-lg rounded-[30px] py-3 pr-2 pl-4 border-2 border-[#40B7BA]"
                    >
                      next
                      <ChevronRightIcon />
                    </div>
                  </div>
                )}
              </section>
              <Snackbar
                open={displayProfileSavedToaster}
                autoHideDuration={5000}
                onClose={() => setDisplayProfileSavedToaster(false)}
                message="Profile saved"
              />
            </>
          )}
        </Formik>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const protocol = context.req.headers.referer?.split('://')[0] || 'http';
  const { data } = await RequestHelper.get<{ allowRegistrations: boolean }>(
    `${protocol}://${context.req.headers.host}/api/registrations/status`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return {
    props: {
      allowedRegistrations: data.allowRegistrations,
    },
  };
};
