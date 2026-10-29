# Android Credential Manager Integration Guide

This guide explains how to connect Android's **Digital Credentials API (Credential Manager)** with the React Native `VerifiedEmail` native module in your Expo / React Native application.

---

## 1. Required Android Gradle Dependencies

In your `android/app/build.gradle` (or via an Expo Config Plugin), add:

```groovy
dependencies {
    implementation("androidx.credentials:credentials:1.7.0-alpha03")
    implementation("androidx.credentials:credentials-play-services-auth:1.7.0-alpha03")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.0")
}
```

---

## 2. Kotlin Native Module: `VerifiedEmailModule.kt`

Place this in `android/app/src/main/java/com/votingapp/VerifiedEmailModule.kt`:

```kotlin
package com.votingapp

import android.app.Activity
import androidx.credentials.CredentialManager
import androidx.credentials.GetCredentialRequest
import androidx.credentials.GetDigitalCredentialOption
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.security.SecureRandom
import java.util.Base64

class VerifiedEmailModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "VerifiedEmail"

    private val scope = CoroutineScope(Dispatchers.Main)

    @ReactMethod
    fun verifyEmail(promise: Promise) {
        val currentActivity: Activity? = currentActivity
        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_NULL", "Activity is not available")
            return
        }

        // 1. Generate a cryptographically random nonce
        val randomBytes = ByteArray(32)
        SecureRandom().nextBytes(randomBytes)
        val nonce = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes)

        // 2. Build OpenID4VP Digital Credential Request for Google Account email
        val requestJson = """
            {
                "providers": [{
                    "protocol": "openid4vp",
                    "request": {
                        "client_id": "voting-app",
                        "response_type": "vp_token",
                        "nonce": "$nonce",
                        "presentation_definition": {
                            "id": "email_verification",
                            "input_descriptors": [{
                                "id": "google_email",
                                "purpose": "Verify your Google email address",
                                "schema": [{"uri": "https://identity.google.com/credentials/email"}]
                            }]
                        }
                    }
                }]
            }
        """.trimIndent()

        val credentialOption = GetDigitalCredentialOption(requestJson)
        val request = GetCredentialRequest.Builder()
            .addCredentialOption(credentialOption)
            .build()

        val credentialManager = CredentialManager.create(currentActivity)

        scope.launch {
            try {
                // 3. Invoke Android Credential Manager consent sheet
                val result = credentialManager.getCredential(
                    request = request,
                    context = currentActivity
                )

                val responseData = Arguments.createMap().apply {
                    putString("credential", result.credential.data.getString("androidx.credentials.BUNDLE_KEY_RESPONSE_JSON", ""))
                    putString("nonce", nonce)
                }

                // 4. Resolve raw credential to React Native for backend validation
                promise.resolve(responseData)

            } catch (e: GetCredentialCancellationException) {
                promise.reject("E_CANCELLED", "User cancelled credential selection")
            } catch (e: GetCredentialException) {
                promise.reject("E_CREDENTIAL_ERROR", e.localizedMessage, e)
            } catch (e: Exception) {
                promise.reject("E_UNEXPECTED", e.localizedMessage, e)
            }
        }
    }
}
```

---

## 3. Register the Package in `MainApplication.kt`

```kotlin
package com.votingapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class VerifiedEmailPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(VerifiedEmailModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
```

In `MainApplication.kt`, add `VerifiedEmailPackage()` to `getPackages()`.

---

## 4. Backend Cryptographic Verification Flow

When the app sends `{ credential, nonce }` to your backend (`/auth/verify-email-credential`):
1. The backend parses the signed VP (Verifiable Presentation) token using Google's public key.
2. Checks that `nonce` matches the one submitted in the request.
3. Checks that the credential has not expired.
4. Extracts the verified email and returns:
   ```json
   {
     "email": "john.doe@gmail.com",
     "verified": true,
     "verifiedAt": "2026-10-30T00:30:00Z",
     "provider": "google_credential_manager"
   }
   ```
